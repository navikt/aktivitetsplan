import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Checkbox, Detail } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';

import { Status } from '../../../../../createGenericSlice';
import { isArenaAktivitet } from '../../../../../datatypes/aktivitetTypes';
import { ArenaAktivitet } from '../../../../../datatypes/arenaAktivitetTypes';
import { Forhaandsorientering, ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import { EksternAktivitet, isEksternAktivitet } from '../../../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../../../felles-komponenter/hooks/useAppDispatch';
import { loggForhandsorienteringTiltak } from '../../../../../felles-komponenter/utils/logging';
import { selectDialogStatus } from '../../../../dialog/dialog-selector';
import { settAktivitetTilAvtalt } from '../../../aktivitet-actions';
import { selectArenaAktivitetStatus } from '../../../arena-aktivitet-selector';
import { sendForhaandsorienteringArenaAktivitet } from '../../../arena-aktiviteter-slice';
import ForhaandsorienteringsMeldingArenaaktivitet from '../arena-aktivitet/ForhaandsorienteringsMeldingArenaaktivitet';
import { AVTALT_TEKST, AVTALT_TEKST_119 } from '../utilsForhaandsorientering';
import { selectNyesteOppfolgingsperiode } from '../../../../oppfolging-status/oppfolging-selector';

interface Props {
    aktivitet: EksternAktivitet | ArenaAktivitet;
    setSendtAtErAvtaltMedNav(): void;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

export const schema = z.discriminatedUnion('forhaandsorienteringType', [
    z.object({
        forhaandsorienteringType: z.literal(ForhaandsorienteringType.SEND_STANDARD),
    }),
    z.object({
        forhaandsorienteringType: z.literal(ForhaandsorienteringType.SEND_PARAGRAF_11_9),
        avtaltText119: z.string().min(1, 'Du må fylle ut teksten').max(500, 'Du må korte ned teksten til 500 tegn'),
    }),
]);

export type ForhaandsorienteringFormValues = z.infer<typeof schema>;

const ForhaandsorienteringForm = (props: Props) => {
    const { aktivitet, setSendtAtErAvtaltMedNav, setForhandsorienteringType } = props;

    const [showForm, setShowForm] = useState(false);

    const currentOpenOppfolgingsperiode = useSelector(selectNyesteOppfolgingsperiode);
    const dialogStatus = useSelector(selectDialogStatus);
    const arenaAktivitetRequestStatus = useSelector(selectArenaAktivitetStatus);
    const dispatch = useAppDispatch();

    const defaultValues: ForhaandsorienteringFormValues = {
        forhaandsorienteringType: ForhaandsorienteringType.SEND_STANDARD as any,
        avtaltText119: AVTALT_TEKST_119,
    };

    const isArena = isArenaAktivitet(aktivitet);

    const { register, handleSubmit, watch } = useForm<ForhaandsorienteringFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
    });

    const onSubmit = (formValues: ForhaandsorienteringFormValues) => {
        const tekst =
            formValues.forhaandsorienteringType === ForhaandsorienteringType.SEND_STANDARD
                ? AVTALT_TEKST
                : formValues.avtaltText119;

        const forhaandsorientering: Forhaandsorientering = {
            type: formValues.forhaandsorienteringType,
            tekst,
        };

        setForhandsorienteringType(formValues.forhaandsorienteringType);
        const settTilAvtalt = isArena
            ? currentOpenOppfolgingsperiode
                ? dispatch(
                      sendForhaandsorienteringArenaAktivitet({
                          arenaAktivitet: aktivitet,
                          forhaandsorientering,
                          oppfolgingsPeriodeId: currentOpenOppfolgingsperiode.uuid,
                      }),
                  ) // Skal ikke kunne vise denne formen hvis man ikke er under oppfølging så dette skal ikke skje
                : new Promise((resolve) => resolve(undefined))
            : dispatch(settAktivitetTilAvtalt({ aktivitet, forhaandsorientering }));
        return settTilAvtalt.then(() => {
            setSendtAtErAvtaltMedNav();
            loggForhandsorienteringTiltak();
            // @ts-ignore
            document.querySelector('.aktivitet-modal')?.focus();
        });
    };

    const lasterData =
        dialogStatus !== Status.OK ||
        arenaAktivitetRequestStatus === Status.RELOADING ||
        arenaAktivitetRequestStatus === Status.PENDING;

    const erEksternAktivitet = isEksternAktivitet(aktivitet);

    return (
        <form
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className="bg-surface-alt-3-subtle py-2 px-4 border border-border-alt-3 rounded-md"
        >
            <div className="flex items-center justify-between">
                <Checkbox disabled={lasterData} onChange={() => setShowForm(!showForm)}>
                    Legg til forhåndsorientering
                </Checkbox>
                <Detail>FOR NAV-ANSATT</Detail>
            </div>
            {erEksternAktivitet || isArena ? (
                <p className="mt-2">Tiltaket er automatisk merket &quot;Avtalt med Nav&quot;</p>
            ) : null}
            {showForm ? (
                <ForhaandsorienteringsMeldingArenaaktivitet lasterData={lasterData} register={register} watch={watch} />
            ) : null}
        </form>
    );
};

export default ForhaandsorienteringForm;
