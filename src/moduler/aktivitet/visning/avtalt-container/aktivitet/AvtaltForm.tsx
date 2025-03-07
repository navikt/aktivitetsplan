import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Button, Checkbox, Detail, HelpText } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';

import { Forhaandsorientering, ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import { EksternAktivitet, VeilarbAktivitet } from '../../../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../../../felles-komponenter/hooks/useAppDispatch';
import { DirtyContext } from '../../../../context/dirty-context';
import { selectSettAktivitetTilAvtaltFeil } from '../../../../feilmelding/feil-selector';
import Feilmelding from '../../../../feilmelding/Feilmelding';
import { settAktivitetTilAvtalt } from '../../../aktivitet-actions';
import { useKanSendeVarsel, useSendAvtaltMetrikker } from '../avtaltHooks';
import { AVTALT_TEKST, AVTALT_TEKST_119, getForhaandsorienteringText } from '../utilsForhaandsorientering';
import ForhaandsorienteringsMelding from './ForhaandsorienteringsMelding';
import KanIkkeSendeForhaandsorienteringInfotekst from './KanIkkeSendeForhaandsorienteringInfotekst';

interface Props {
    aktivitet: Exclude<VeilarbAktivitet, EksternAktivitet>;
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
    const { aktivitet, lasterData, mindreEnnSyvDagerTil, setSendtAtErAvtaltMedNav, setForhandsorienteringType } = props;

    const [showForm, setShowForm] = useState(false);

    const dispatch = useAppDispatch();
    const sendMetrikker = useSendAvtaltMetrikker();

    const doSettAktivitetTilAvtalt = (avtaltAktivitet: VeilarbAktivitet, forhaandsorientering: Forhaandsorientering) =>
        dispatch(settAktivitetTilAvtalt({ aktivitet: avtaltAktivitet, forhaandsorientering }));

    const onSubmitHandler = (
        forhaandsorienteringDialogFormValues: ForhaandsorienteringDialogFormValues,
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
        setValue,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<ForhaandsorienteringDialogFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
    });

    const forhaandsorienteringType = watch('forhaandsorienteringType');
    const avtaltText119 = watch('avtaltText119');

    const { setFormIsDirty } = useContext(DirtyContext);

    const feil = useSelector(selectSettAktivitetTilAvtaltFeil);

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
                <Checkbox onChange={() => setShowForm(!showForm)}>Avtalt med Nav</Checkbox>
                <HelpText
                    aria-label="Informasjon om avtalt med Nav"
                    title="Informasjon om avtalt med Nav"
                    id="hjelp"
                    className="ml-2 justify-self-start"
                >
                    <div className="max-w-[300px]">
                        Aktiviteter som oppfyller brukerens aktivitets- og medvirkningsplikt skal settes som
                        &quot;Avtalt med Nav&quot;
                    </div>
                </HelpText>
                <Detail className="text-right flex-grow">FOR NAV-ANSATT</Detail>
            </div>
            {showForm && (
                <div className="space-y-4 mb-4">
                    <KanIkkeSendeForhaandsorienteringInfotekst
                        mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                        manglerTilDato={!aktivitet.tilDato}
                    />
                    {kanSendeForhaandsvarsel ? (
                        <ForhaandsorienteringsMelding
                            register={register}
                            setValue={(forhaandsorienteringType: ForhaandsorienteringType) => setValue('forhaandsorienteringType', forhaandsorienteringType)}
                            forhaandsorienteringType={forhaandsorienteringType}
                            avtaltText119={avtaltText119}
                            oppdaterer={isSubmitting}
                            errors={errors}
                        />
                    ) : null}
                    <Feilmelding feilmeldinger={feil} />
                    <Button loading={isSubmitting} disabled={lasterData}>
                        Legg til
                    </Button>
                </div>
            )}
        </form>
    );
};

export default AvtaltForm;
