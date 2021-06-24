import { Hovedknapp } from 'nav-frontend-knapper';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import React, { useState } from 'react';

import { ReactComponent as VarselIkon } from '../../../../Ikoner/advarsel-ikon.svg';
import DeleLinje from '../delelinje/delelinje';
import detaljVisningStyles from './AktivitetinformasjonVisning.module.less';
import styles from './MeldInteresseForStillingen.module.less';

enum SvarType {
    JA,
    NEI,
}

export const MeldInteresseForStillingen = () => {
    const [svar, setSvar] = useState<string>('');

    const onChange = (event: any, value: string) => {
        setSvar(value);
    };

    return (
        <>
            <DeleLinje />
            <div className={detaljVisningStyles.underseksjon}>
                <RadioPanelGruppe
                    name="MeldInteresseForStillingen"
                    legend={
                        <div className={styles.overskrift}>
                            <VarselIkon className={styles.varselIkon} />
                            <Element className={styles.tekst}>Er du interessert i denne stillingen?</Element>
                        </div>
                    }
                    radios={[
                        {
                            label: 'Ja, og NAV kan dele CV-en min med arbeidsgiver',
                            value: 'ja',
                            id: SvarType.JA.toString(),
                        },
                        {
                            label: 'Nei, og jeg vil ikke at NAV skal dele CV-en min med arbeidsgiveren',
                            value: 'nei',
                            id: SvarType.NEI.toString(),
                        },
                    ]}
                    checked={svar}
                    onChange={onChange}
                />
                <Hovedknapp mini className={styles.knapp}>
                    Lagre
                </Hovedknapp>
            </div>
        </>
    );
};
