import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { formaterDatoManed } from '../../../../utils';
import { oppdaterCVSvar } from '../../aktivitet-actions';
import detaljVisningStyles from '../Aktivitetsvisning.module.less';
import { CustomAlertstripe } from '../hjelpekomponenter/CustomAlertstripe';
import styles from './MeldInteresseForStilling.module.less';
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

export const MeldInteresseForStilling = ({ aktivitet, overskrift, Ingress }: PropTypes) => {
    const [valgtAlternativ, setValgtAlternativ] = useState<SvarType | undefined>(undefined);
    const [infoTekst, setInfoTekst] = useState<string | undefined>(undefined);
    const dispatch = useDispatch();

    const onChange = (event: any, value: string) => {
        setValgtAlternativ(value as SvarType);

        if (value === SvarType.JA) {
            setInfoTekst('Stillingen flyttes til "Gjennomfører"');
        }
        if (value === SvarType.NEI) {
            setInfoTekst('Stillingen flyttes til "Avbrutt"');
        }
    };

    const onClick = () => {
        dispatch(oppdaterCVSvar(aktivitet.id, aktivitet.versjon, valgtAlternativ === SvarType.JA));
    };

    const svarfrist = aktivitet.stillingFraNavData?.svarfrist;

    const HeaderMedIngress = () => (
        <>
            <CustomAlertstripe tekst={overskrift} />
            <div className={styles.luft} />
            <Ingress />
            {svarfrist && (
                <Normaltekst className={styles.svarfrist}>Svar før: {formaterDatoManed(svarfrist)}</Normaltekst>
            )}
        </>
    );

    return (
        <div className={detaljVisningStyles.underseksjon}>
            <RadioPanelGruppe
                name="MeldInteresseForStillingen"
                legend={<HeaderMedIngress />}
                radios={[
                    {
                        label: JaSvarTekst,
                        value: SvarType.JA.toString(),
                        id: SvarType.JA.toString(),
                    },
                    {
                        label: NeiSvarTekst,
                        value: SvarType.NEI.toString(),
                        id: SvarType.NEI.toString(),
                    },
                ]}
                checked={valgtAlternativ?.toString()}
                onChange={onChange}
            />
            {infoTekst && <AlertStripe children={infoTekst} type="info" form="inline" className={styles.infoboks} />}
            <Hovedknapp children="Lagre" mini className={styles.knapp} onClick={onClick} disabled={!valgtAlternativ} />
        </div>
    );
};
