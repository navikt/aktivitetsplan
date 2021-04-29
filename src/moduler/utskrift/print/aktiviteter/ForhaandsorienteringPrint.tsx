import Tekstomrade from 'nav-frontend-tekstomrade';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { formaterDatoKortManed } from '../../../../utils';
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
            <Tekstomrade className={styles.forhaandsorientering}>{forhaandsorienteringTekst}</Tekstomrade>

            {forhaandsorienteringLest && (
                <Normaltekst className={styles.lestTekst}>
                    Lest {formaterDatoKortManed(forhaandsorienteringLest)}
                </Normaltekst>
            )}
        </div>
    );
};

export default ForhaandsorienteringPrint;
