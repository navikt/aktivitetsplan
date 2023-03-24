import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Alert, Checkbox, Detail } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';

import { STATUS } from '../../../../../api/utils';
import { ArenaAktivitet } from '../../../../../datatypes/arenaAktivitetTypes';
import { Forhaandsorientering, ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import { loggForhandsorienteringTiltak } from '../../../../../felles-komponenter/utils/logging';
import { selectDialogStatus } from '../../../../dialog/dialog-selector';
import { selectArenaAktivitetStatus } from '../../../arena-aktivitet-selector';
import { sendForhaandsorienteringArenaAktivitet } from '../../../arena-aktiviteter-reducer';
import { AVTALT_TEKST, AVTALT_TEKST_119 } from '../utilsForhaandsorientering';
import ForhaandsorienteringsMeldingArenaaktivitet from './ForhaandsorienteringsMeldingArenaaktivitet';

interface Props {
    aktivitet: ArenaAktivitet;
    setSendtAtErAvtaltMedNav(): void;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

const schema = z.discriminatedUnion('forhaandsorienteringType', [
    z.object({
        forhaandsorienteringType: z.literal(ForhaandsorienteringType.SEND_STANDARD),
    }),
    z.object({
        forhaandsorienteringType: z.literal(ForhaandsorienteringType.SEND_PARAGRAF_11_9),
        avtaltText119: z.string().min(1, 'Du må fylle ut teksten').max(500, 'Du må korte ned teksten til 500 tegn'),
    }),
]);

export type ArenaForhaandsorienteringFormValues = z.infer<typeof schema>;

const ArenaForhaandsorienteringForm = (props: Props) => {
    const { aktivitet, setSendtAtErAvtaltMedNav, setForhandsorienteringType } = props;

    const [showForm, setShowForm] = useState(false);

    const dialogStatus = useSelector(selectDialogStatus);
    const arenaAktivitetRequestStatus = useSelector(selectArenaAktivitetStatus);
    const dispatch = useDispatch();

    const defaultValues: ArenaForhaandsorienteringFormValues = {
        forhaandsorienteringType: ForhaandsorienteringType.SEND_STANDARD as any,
        avtaltText119: AVTALT_TEKST_119,
    };

    const { register, handleSubmit, watch } = useForm<ArenaForhaandsorienteringFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
    });

    const onSubmit = (formValues: ArenaForhaandsorienteringFormValues) => {
        const tekst =
            formValues.forhaandsorienteringType === ForhaandsorienteringType.SEND_STANDARD
                ? AVTALT_TEKST
                : formValues.avtaltText119;

        const forhaandsorientering: Forhaandsorientering = {
            type: formValues.forhaandsorienteringType,
            tekst,
        };

        setForhandsorienteringType(formValues.forhaandsorienteringType);
        return sendForhaandsorienteringArenaAktivitet(
            aktivitet,
            forhaandsorientering
        )(dispatch).then(() => {
            setSendtAtErAvtaltMedNav();
            loggForhandsorienteringTiltak();
            // @ts-ignore
            document.querySelector('.aktivitet-modal').focus();
        });
    };

    const lasterData =
        dialogStatus !== STATUS.OK ||
        arenaAktivitetRequestStatus === STATUS.RELOADING ||
        arenaAktivitetRequestStatus === STATUS.PENDING;

    return (
        <form
            className="border border-border-alt-3 bg-surface-alt-3-subtle flex flex-col rounded-md p-4"
            onSubmit={handleSubmit((data) => onSubmit(data))}
        >
            <div className="flex items-center justify-between">
                <Checkbox disabled={lasterData} onChange={() => setShowForm(!showForm)}>
                    Legg til forhåndsorientering
                </Checkbox>
                <Detail>FOR NAV-ANSATT</Detail>
            </div>
            <Alert variant="info" className="mt-2" inline>
                Tiltaket er automatisk merket &quot;Avtalt med NAV&quot;
            </Alert>
            {showForm && (
                <ForhaandsorienteringsMeldingArenaaktivitet lasterData={lasterData} register={register} watch={watch} />
            )}
        </form>
    );
};

export default ArenaForhaandsorienteringForm;
