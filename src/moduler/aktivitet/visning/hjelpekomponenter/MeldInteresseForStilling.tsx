import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { STATUS_AVBRUTT, STATUS_GJENNOMFOERT } from '../../../../constant';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { ReactComponent as VarselIkon } from '../../../../Ikoner/advarsel-ikon.svg';
import DeleLinje from '../delelinje/delelinje';
import { lagreStatusEndringer } from '../status-oppdatering/oppdater-aktivitet-status';
import detaljVisningStyles from './AktivitetinformasjonVisning.module.less';
import styles from './MeldInteresseForStillingen.module.less';

enum SvarType {
    JA = 'ja',
    NEI = 'nei',
}

interface PropTypes {
    aktivitet: Aktivitet;
}

export const MeldInteresseForStillingen = ({ aktivitet }: PropTypes) => {
    const [svar, setSvar] = useState<SvarType | undefined>(undefined);
    const [infoTekst, setInfoTekst] = useState<string | undefined>(undefined);
    const dispatch = useDispatch();

    const onChange = (event: any, value: string) => {
        setSvar(value as SvarType);

        if (value == SvarType.JA) {
            setInfoTekst('Stillingen flyttes til "Gjennomfører"');
        }
        if (value == SvarType.NEI) {
            setInfoTekst('Stillingen flyttes til "Avbrutt"');
        }
    };

    const endreAktivitetstatus = () => {
        if (svar === SvarType.JA) {
            lagreStatusEndringer(dispatch, { aktivitetstatus: STATUS_GJENNOMFOERT }, aktivitet);
        } else if (svar === SvarType.NEI) {
            lagreStatusEndringer(dispatch, { aktivitetstatus: STATUS_AVBRUTT }, aktivitet);
        }
    };

    const onClick = () => {
        endreAktivitetstatus();
    };

    return (
        <>
            <DeleLinje />
            <div className={detaljVisningStyles.underseksjon}>
                <RadioPanelGruppe
                    name="MeldInteresseForStillingen"
                    legend={
                        <>
                            <div className={styles.overskrift}>
                                <VarselIkon className={styles.varselIkon} />
                                <Element className={styles.tekst}>Er du interessert i denne stillingen?</Element>
                            </div>
                            <p className={styles.ingress}>
                                Du bestemmer selv om nav skal dele CV-en din på denne stillingen
                            </p>
                        </>
                    }
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
                    checked={svar?.toString()}
                    onChange={onChange}
                />
                {infoTekst && (
                    <AlertStripe type="info" form="inline" className={styles.infoboks}>
                        {infoTekst}
                    </AlertStripe>
                )}
                <Hovedknapp mini className={styles.knapp} onClick={onClick} disabled={!svar}>
                    Lagre
                </Hovedknapp>
            </div>
        </>
    );
};
