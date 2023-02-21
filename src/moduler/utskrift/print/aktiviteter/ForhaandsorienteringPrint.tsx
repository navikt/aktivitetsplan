import { BodyShort, Heading } from '@navikt/ds-react';
import Tekstomrade from 'nav-frontend-tekstomrade';
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
            <Heading level="2" size="xsmall" className={styles.tittel}>
                Informasjon om ansvaret ditt
            </Heading>
            <Tekstomrade className={styles.forhaandsorientering}>{forhaandsorienteringTekst}</Tekstomrade>

            {forhaandsorienteringLest && (
                <BodyShort size="small" className={styles.lestTekst}>
                    Lest {formaterDatoManed(forhaandsorienteringLest)}
                </BodyShort>
            )}
        </div>
    );
};

export default ForhaandsorienteringPrint;
