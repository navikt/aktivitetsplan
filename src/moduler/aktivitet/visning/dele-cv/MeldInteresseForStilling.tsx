import useFormstate from '@nutgaard/use-formstate';
import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import { RadioGruppe } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import { RadioPanel } from '../../../../felles-komponenter/skjema/input/Radio';
import { formaterDatoManed } from '../../../../utils';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import { oppdaterCVSvar } from '../../aktivitet-actions';
import detaljVisningStyles from '../Aktivitetsvisning.module.less';
import { CustomAlertstripe } from '../hjelpekomponenter/CustomAlertstripe';
import { Ingress } from './DeleCvContainer';
import styles from './MeldInteresseForStilling.module.less';
import { SvarPaaVegneAvBruker } from './SvarPaaVegneAvBruker';
import { JaSvarTekst, NeiSvarTekst } from './tekster';

enum SvarType {
    JA = 'ja',
    NEI = 'nei',
}

interface PropTypes {
    aktivitet: Aktivitet;
    overskrift: string;
}

type KanDeles = {
    kanDeles: string;
    avtaltDato: string;
};
type ErVeileder = {
    erVeileder: boolean;
};

export const MeldInteresseForStilling = ({ aktivitet, overskrift }: PropTypes) => {
    const [infoTekst, setInfoTekst] = useState<string | undefined>(undefined);
    const dispatch = useDispatch();

    const erVeileder = useSelector(selectErVeileder);

    const validator = useFormstate<KanDeles, ErVeileder>({
        avtaltDato: (value, values, props) => {
            if (props.erVeileder && !value) return 'Du må fylle ut datoen for når du var i dialog med brukeren';
        },
        kanDeles: (value) => {
            if (!value) return 'Du må svare ja eller nei';
        },
    });

    const state = validator({ kanDeles: '', avtaltDato: '' }, { erVeileder });

    const onChange = (event: any) => {
        const value = event.target.value;
        if (value === SvarType.JA) {
            setInfoTekst('Stillingen flyttes til "Gjennomfører"');
        }
        if (value === SvarType.NEI) {
            setInfoTekst('Stillingen flyttes til "Avbrutt"');
        }
        state.fields.kanDeles?.input.onChange(event);
    };

    const onSubmit = (data: KanDeles) => {
        dispatch(oppdaterCVSvar(aktivitet.id, aktivitet.versjon, data.kanDeles === SvarType.JA, data.avtaltDato));
        return Promise.resolve();
    };

    const svarfrist = aktivitet.stillingFraNavData?.svarfrist;

    return (
        <form className={detaljVisningStyles.underseksjon} onSubmit={state.onSubmit(onSubmit)} noValidate>
            <CustomAlertstripe tekst={overskrift} />
            <div className={styles.luft} />
            <Ingress />
            <SvarPaaVegneAvBruker formhandler={state.fields.avtaltDato} />
            <Normaltekst className={styles.svarfrist}>Svar før: {formaterDatoManed(svarfrist)}</Normaltekst>
            <RadioGruppe
                aria-label={overskrift}
                role="radiogroup"
                className="inputPanelGruppe"
                feil={state.submittoken && state.fields.kanDeles.error}
            >
                <RadioPanel
                    id="kanDeles"
                    label={JaSvarTekst}
                    value={SvarType.JA.toString()}
                    {...state.fields.kanDeles}
                    input={{ ...state.fields.kanDeles.input, onChange: onChange }}
                />
                <RadioPanel
                    label={NeiSvarTekst}
                    value={SvarType.NEI.toString()}
                    {...state.fields.kanDeles}
                    input={{ ...state.fields.kanDeles.input, onChange: onChange }}
                />
            </RadioGruppe>
            {infoTekst && <AlertStripe children={infoTekst} type="info" form="inline" className={styles.infoboks} />}
            {erVeileder && <FormErrorSummary errors={state.errors} submittoken={state.submittoken} />}
            <Hovedknapp children="Lagre" mini className={styles.knapp} />
        </form>
    );
};
