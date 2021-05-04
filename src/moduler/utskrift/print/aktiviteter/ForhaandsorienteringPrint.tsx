import Tekstomrade from 'nav-frontend-tekstomrade';
import { EtikettLiten, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { formaterDatoManed } from '../../../../utils';
import styles from './ForhaandsorienteringPrint.module.less';

interface Props {
    forhaandsorienteringTekst?: string;
    forhaandsorienteringLest?: string;
}

const ForhaandsorienteringPrint = (props: Props) => {
    const { forhaandsorienteringTekst, forhaandsorienteringLest } = props;

    if (!forhaandsorienteringTekst) {
        return null;
    }

    return (
        <div className="aktivitetvisning__detaljer aktivitetsdetaljer">
            <EtikettLiten className={styles.tittel} tag="h2">
                Informasjon om ansvaret ditt
            </EtikettLiten>
            <Tekstomrade className={styles.forhaandsorientering}>{forhaandsorienteringTekst}</Tekstomrade>

            {forhaandsorienteringLest && (
                <Normaltekst className={styles.lestTekst}>
                    Lest {formaterDatoManed(forhaandsorienteringLest)}
                </Normaltekst>
            )}
        </div>
    );
};

export default ForhaandsorienteringPrint;
