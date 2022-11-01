import useFormstate from '@nutgaard/use-formstate';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../../../api/utils';
import { ArenaAktivitet } from '../../../../../datatypes/arenaAktivitetTypes';
import { ForhaandsorienteringType } from '../../../../../datatypes/forhaandsorienteringTypes';
import Checkbox from '../../../../../felles-komponenter/skjema/input/Checkbox';
import { loggForhandsorienteringTiltak } from '../../../../../felles-komponenter/utils/logging';
import { selectDialogStatus } from '../../../../dialog/dialog-selector';
import { selectArenaAktivitetStatus } from '../../../arena-aktivitet-selector';
import { sendForhaandsorienteringArenaAktivitet } from '../../../arena-aktiviteter-reducer';
import ForNavAnsattMarkeringWrapper from '../../hjelpekomponenter/ForNavAnsattMarkeringWrapper';
import styles from './ArenaForhaandsorienteringForm.module.less';
import ForhaandsorienteringsMeldingArenaaktivitet from './ForhaandsorienteringsMeldingArenaaktivitet';

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
    aktivitet: ArenaAktivitet;
    hidden: boolean;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

type FormType = {
    tekst: string;
    checked: string;
    forhaandsorienteringType: string;
};

const ArenaForhaandsorienteringForm = (props: Props) => {
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
        return sendForhaandsorienteringArenaAktivitet(aktivitet, {
            tekst,
            type: data.forhaandsorienteringType,
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

    return (
        <form onSubmit={state.onSubmit(onSubmit)}>
            <ForNavAnsattMarkeringWrapper>
                <Normaltekst className={styles.tittel}>Tiltaket er automatisk merket "Avtalt med NAV"</Normaltekst>
            </ForNavAnsattMarkeringWrapper>

            <SkjemaGruppe>
                <Checkbox label="Legg til forhåndsorientering" disabled={lasterData} {...state.fields.checked} />

                <ForhaandsorienteringsMeldingArenaaktivitet
                    visible={state.fields.checked.input.value === 'true'}
                    lasterData={lasterData}
                    state={state}
                />
            </SkjemaGruppe>
        </form>
    );
};

export default ArenaForhaandsorienteringForm;
