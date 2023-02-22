import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import { formaterDatoManed } from '../../../../../utils';
import styles from './LestDatoVisning.module.less';

interface Props {
    hidden: boolean;
    lest?: string;
}

const LestDatoVisning = (props: Props) => {
    const { hidden, lest } = props;

    if (hidden) {
        return null;
    }

    return <BodyShort className={styles.lestDato}>Lest {formaterDatoManed(lest)}</BodyShort>;
};

export default LestDatoVisning;
