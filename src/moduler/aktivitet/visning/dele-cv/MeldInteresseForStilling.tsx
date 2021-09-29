import useFormstate from '@nutgaard/use-formstate';
import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import { RadioGruppe } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Radio from '../../../../felles-komponenter/skjema/input/Radio';
import { formaterDatoManed } from '../../../../utils';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import { oppdaterCVSvar } from '../../aktivitet-actions';
import detaljVisningStyles from '../Aktivitetsvisning.module.less';
import { CustomAlertstripe } from '../hjelpekomponenter/CustomAlertstripe';
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
    Ingress: () => ReactElement;
}

type KanDeles = {
    kanDeles: string;
    avtaltDato: string;
};

export const MeldInteresseForStilling = ({ aktivitet, overskrift, Ingress }: PropTypes) => {
    const [infoTekst, setInfoTekst] = useState<string | undefined>(undefined);
    const dispatch = useDispatch();

    const erVeileder = useSelector(selectErVeileder);

    const validator = useFormstate<KanDeles>({
        kanDeles: (value) => {
            if (!value) return 'Du må svare ja eller nei';
        },
        avtaltDato: (value) => {
            if (erVeileder && !value) return 'Du må fylle ut datoen for når du var i dialog med brukeren';
        },
    });

    const state = validator({ kanDeles: '', avtaltDato: '' });

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

    const HeaderMedIngress = () => (
        <>
            <CustomAlertstripe tekst={overskrift} />
            <div className={styles.luft} />
            <Ingress />
            <SvarPaaVegneAvBruker formhandler={state.fields.avtaltDato} />
            {svarfrist && (
                <Normaltekst className={styles.svarfrist}>Svar før: {formaterDatoManed(svarfrist)}</Normaltekst>
            )}
        </>
    );
    return (
        <form className={detaljVisningStyles.underseksjon} onSubmit={state.onSubmit(onSubmit)}>
            <HeaderMedIngress />
            <RadioGruppe feil={state.submittoken && state.fields.kanDeles.error}>
                <Radio
                    label={JaSvarTekst}
                    value={SvarType.JA.toString()}
                    {...state.fields.kanDeles}
                    input={{ ...state.fields.kanDeles.input, onChange: onChange }}
                />
                <Radio
                    label={NeiSvarTekst}
                    value={SvarType.NEI.toString()}
                    {...state.fields.kanDeles}
                    input={{ ...state.fields.kanDeles.input, onChange: onChange }}
                />
            </RadioGruppe>
            {infoTekst && <AlertStripe children={infoTekst} type="info" form="inline" className={styles.infoboks} />}
            <FormErrorSummary errors={state.errors} submittoken={state.submittoken} />
            <Hovedknapp children="Lagre" mini className={styles.knapp} />
        </form>
    );
};
