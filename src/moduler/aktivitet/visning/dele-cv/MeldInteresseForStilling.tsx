import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { oppdaterCVSvar } from '../../aktivitet-actions';
import detaljVisningStyles from '../Aktivitetsvisning.module.less';
import { CustomAlertstripe } from '../hjelpekomponenter/CustomAlertstripe';
import styles from './MeldInteresseForStillingen.module.less';

enum SvarType {
    JA = 'ja',
    NEI = 'nei',
}

interface PropTypes {
    aktivitet: Aktivitet;
}

export const MeldInteresseForStilling = ({ aktivitet }: PropTypes) => {
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

    const HeaderMedIngress = () => (
        <>
            <CustomAlertstripe tekst="Er du interessert i denne stillingen?" />
            <p className={styles.ingress}>Du bestemmer selv om nav skal dele CV-en din på denne stillingen</p>
        </>
    );

    return (
        <div className={detaljVisningStyles.underseksjon}>
            <RadioPanelGruppe
                name="MeldInteresseForStillingen"
                legend={<HeaderMedIngress />}
                radios={[
                    {
                        label: 'Ja, og NAV kan dele CV-en min med arbeidsgiver',
                        value: SvarType.JA.toString(),
                        id: SvarType.JA.toString(),
                    },
                    {
                        label: 'Nei, og jeg vil ikke at NAV skal dele CV-en min med arbeidsgiveren',
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
