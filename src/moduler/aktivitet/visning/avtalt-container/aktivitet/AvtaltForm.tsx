import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Button, Checkbox, Detail, HelpText } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { z } from 'zod';

import { Forhaandsorientering, ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import { EksternAktivitet, VeilarbAktivitet } from '../../../../../datatypes/internAktivitetTypes';
import Innholdslaster from '../../../../../felles-komponenter/utils/Innholdslaster';
import { DirtyContext } from '../../../../context/dirty-context';
import { selectNivaa4Status } from '../../../../tilgang/tilgang-selector';
import { settAktivitetTilAvtalt } from '../../../aktivitet-actions';
import { useKanSendeVarsel, useSendAvtaltMetrikker } from '../avtaltHooks';
import { AVTALT_TEKST, AVTALT_TEKST_119, getForhaandsorienteringText } from '../utilsForhaandsorientering';
import ForhaandsorienteringsMelding from './ForhaandsorienteringsMelding';
import KanIkkeSendeForhaandsorienteringInfotekst from './KanIkkeSendeForhaandsorienteringInfotekst';

interface Props {
    aktivitet: Exclude<VeilarbAktivitet, EksternAktivitet>;
    oppdaterer: boolean;
    lasterData: boolean;
    mindreEnnSyvDagerTil: boolean;
    setSendtAtErAvtaltMedNav(): void;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

const schema = z.discriminatedUnion('forhaandsorienteringType', [
    z.object({
        forhaandsorienteringType: z.literal(ForhaandsorienteringType.SEND_STANDARD),
        avtaltText: z.literal(AVTALT_TEKST),
    }),
    z.object({
        forhaandsorienteringType: z.literal(ForhaandsorienteringType.SEND_PARAGRAF_11_9),
        avtaltText119: z
            .string()
            .min(1, 'Tekst til brukeren er påkrevd')
            .max(500, 'Du må korte ned teksten til 500 tegn'),
    }),
    z.object({
        forhaandsorienteringType: z.literal(ForhaandsorienteringType.IKKE_SEND), // NOTE: submitHandleren legger på 'tekst: ""' i request payloaden. se: getForhaandsorienteringText(forhaandsorienteringDialogFormValues)
    }),
]);

export type ForhaandsorienteringDialogFormValues = z.infer<typeof schema>;

const AvtaltForm = (props: Props) => {
    const {
        aktivitet,
        oppdaterer,
        lasterData,
        mindreEnnSyvDagerTil,
        setSendtAtErAvtaltMedNav,
        setForhandsorienteringType,
    } = props;

    const [showForm, setShowForm] = useState(false);

    const dispatch = useDispatch();
    const sendMetrikker = useSendAvtaltMetrikker();
    const avhengigheter = useSelector(selectNivaa4Status);

    const doSettAktivitetTilAvtalt = (avtaltAktivitet: VeilarbAktivitet, forhaandsorientering: Forhaandsorientering) =>
        dispatch(settAktivitetTilAvtalt(avtaltAktivitet, forhaandsorientering) as unknown as AnyAction);

    const onSubmitHandler = (
        forhaandsorienteringDialogFormValues: ForhaandsorienteringDialogFormValues
    ): Promise<void> => {
        const forhaandsorienteringType = forhaandsorienteringDialogFormValues.forhaandsorienteringType;
        setSendtAtErAvtaltMedNav();
        const tekst = getForhaandsorienteringText(forhaandsorienteringDialogFormValues);
        doSettAktivitetTilAvtalt(aktivitet, { type: forhaandsorienteringType, tekst });

        setForhandsorienteringType(forhaandsorienteringType);

        sendMetrikker(forhaandsorienteringType, aktivitet.type, mindreEnnSyvDagerTil);

        return Promise.resolve();
    };

    const kanSendeForhaandsvarsel = useKanSendeVarsel() && !mindreEnnSyvDagerTil;

    const defaultValues: ForhaandsorienteringDialogFormValues = {
        forhaandsorienteringType: kanSendeForhaandsvarsel
            ? ForhaandsorienteringType.SEND_STANDARD
            : ForhaandsorienteringType.IKKE_SEND,
        avtaltText: AVTALT_TEKST,
        avtaltText119: AVTALT_TEKST_119,
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isDirty },
    } = useForm<ForhaandsorienteringDialogFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
    });

    const forhaandsorienteringType = watch('forhaandsorienteringType');
    const avtaltText119 = watch('avtaltText119');

    const { setFormIsDirty } = useContext(DirtyContext);

    useEffect(() => {
        setFormIsDirty('avtalt', isDirty);
        return () => setFormIsDirty('avtalt', false);
    }, [setFormIsDirty, isDirty]);

    return (
        <form
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit((data) => onSubmitHandler(data))}
            className="bg-surface-alt-3-subtle py-2 px-4 my-4 border border-border-alt-3 rounded-md"
        >
            <div className="flex items-center">
                <Checkbox onChange={() => setShowForm(!showForm)}>Avtalt med NAV</Checkbox>
                <HelpText
                    aria-label="Informasjon om avtalt med NAV"
                    title="Informasjon om avtalt med NAV"
                    id="hjelp"
                    className="ml-2 justify-self-start"
                >
                    <div className="max-w-[300px]">
                        Aktiviteter som oppfyller brukerens aktivitets- og medvirkningsplikt skal settes som
                        &quot;Avtalt med NAV&quot;
                    </div>
                </HelpText>
                <Detail className="text-right flex-grow">FOR NAV-ANSATT</Detail>
            </div>
            <Innholdslaster avhengigheter={avhengigheter} visChildrenVedFeil>
                {showForm && (
                    <div className="space-y-4 mb-2">
                        <KanIkkeSendeForhaandsorienteringInfotekst
                            mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                            manglerTilDato={!aktivitet.tilDato}
                        />
                        {kanSendeForhaandsvarsel ? (
                            <ForhaandsorienteringsMelding
                                register={register}
                                forhaandsorienteringType={forhaandsorienteringType}
                                avtaltText119={avtaltText119}
                                oppdaterer={oppdaterer}
                                errors={errors}
                            />
                        ) : null}
                        <Button loading={oppdaterer} disabled={lasterData}>
                            Bekreft
                        </Button>
                    </div>
                )}
            </Innholdslaster>
        </form>
    );
};

export default AvtaltForm;
