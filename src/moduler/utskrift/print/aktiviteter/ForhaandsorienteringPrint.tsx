import { BodyShort, Heading } from '@navikt/ds-react';
import React from 'react';

import { formaterDatoManed } from '../../../../utils/dateUtils';
import CustomBodyLong from '../../../aktivitet/visning/hjelpekomponenter/CustomBodyLong';
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
        <div className="mt-8">
            <Heading level="2" size="xsmall">
                Informasjon om ansvaret ditt
            </Heading>
            <CustomBodyLong className={styles.forhaandsorientering}>{forhaandsorienteringTekst}</CustomBodyLong>

            {forhaandsorienteringLest && (
                <BodyShort size="small" className={styles.lestTekst}>
                    Lest {formaterDatoManed(forhaandsorienteringLest)}
                </BodyShort>
            )}
        </div>
    );
};

export default ForhaandsorienteringPrint;
