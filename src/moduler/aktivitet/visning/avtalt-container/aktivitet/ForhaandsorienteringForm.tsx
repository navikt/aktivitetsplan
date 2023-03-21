import { Alert, Detail } from '@navikt/ds-react';
import useFormstate, { FieldState } from '@nutgaard/use-formstate';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../../../api/utils';
import { AlleAktiviteter } from '../../../../../datatypes/aktivitetTypes';
import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import { EksternAktivitetType, VeilarbAktivitetType } from '../../../../../datatypes/internAktivitetTypes';
import Checkbox from '../../../../../felles-komponenter/skjema/input/Checkbox';
import { loggForhandsorienteringTiltak } from '../../../../../felles-komponenter/utils/logging';
import { selectDialogStatus } from '../../../../dialog/dialog-selector';
import { settAktivitetTilAvtalt } from '../../../aktivitet-actions';
import { selectArenaAktivitetStatus } from '../../../arena-aktivitet-selector';
import ForhaandsorienteringsMeldingArenaaktivitet from '../arena-aktivitet/ForhaandsorienteringsMeldingArenaaktivitet';

const avtaltTekst =
    'Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at ' +
    'stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ' +
    'ber vi deg ta kontakt med veilederen din så snart som mulig.';

const avtaltTekst119 =
    'Du kan få redusert utbetaling av arbeidsavklaringspenger med én stønadsdag hvis du lar være å ' +
    '[komme på møtet vi har innkalt deg til [dato]/ møte på … /levere ... innen [dato]] uten rimelig grunn. Dette går ' +
    'fram av folketrygdloven § 11-9.';

const validate = (val: string) => {
    if (val.trim().length === 0) {
        return 'Du må fylle ut teksten';
    }
    if (val.length > 500) {
        return 'Du må korte ned teksten til 500 tegn';
    }
};

interface Props {
    setSendtAtErAvtaltMedNav(): void;
    aktivitet: AlleAktiviteter;
    hidden: boolean;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

type FormType = {
    tekst: string;
    checked: string;
    forhaandsorienteringType: string;
};

const ForhaandsorienteringForm = (props: Props) => {
    const { setSendtAtErAvtaltMedNav, setForhandsorienteringType, aktivitet, hidden } = props;

    const dialogStatus = useSelector(selectDialogStatus);
    const arenaAktivitetRequestStatus = useSelector(selectArenaAktivitetStatus);
    const dispatch = useDispatch();

    const validator = useFormstate<FormType>({
        tekst: validate,
        checked: () => undefined,
        forhaandsorienteringType: () => undefined,
    });

    const state = validator({
        tekst: avtaltTekst119,
        forhaandsorienteringType: ForhaandsorienteringType.SEND_STANDARD,
        checked: '',
    });

    if (hidden) {
        return null;
    }

    const onSubmit = (data: { forhaandsorienteringType: string; tekst: string }) => {
        const tekst =
            data.forhaandsorienteringType === ForhaandsorienteringType.SEND_STANDARD ? avtaltTekst : data.tekst;

        setForhandsorienteringType(data.forhaandsorienteringType as ForhaandsorienteringType);
        return settAktivitetTilAvtalt(aktivitet, {
            type: data.forhaandsorienteringType,
            tekst,
        })(dispatch).then(() => {
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

    const isGammelArenaAktivitet =
        aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE &&
        [EksternAktivitetType.ARENA_TILTAK_TYPE].includes(aktivitet.eksternAktivitet.type);

    return (
        <form
            onSubmit={state.onSubmit(onSubmit)}
            className="bg-surface-alt-3-subtle py-2 px-4 border border-border-alt-3 rounded-md"
        >
            <div>
                <div className="flex items-center justify-between">
                    <Checkbox disabled={lasterData} {...(state.fields.checked as FieldState & { error: never })}>
                        Legg til forhåndsorientering
                    </Checkbox>
                    <Detail>FOR NAV-ANSATT</Detail>
                </div>
                {isGammelArenaAktivitet && (
                    <Alert variant="info" className="mt-2" inline>
                        Tiltaket er automatisk merket &quot;Avtalt med NAV&quot;
                    </Alert>
                )}
                <ForhaandsorienteringsMeldingArenaaktivitet
                    visible={state.fields.checked.input.value === 'true'}
                    lasterData={lasterData}
                    state={state}
                />
            </div>
        </form>
    );
};

export default ForhaandsorienteringForm;
