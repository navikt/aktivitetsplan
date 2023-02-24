import { WarningColored } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import styles from './CustomAlertstripe.module.less';

interface Props {
    tekst: string;
    sectionClassName?: string;
    ikonClassName?: string;
}

export const CustomAlertstripe = (props: Props) => (
    <div className={props.sectionClassName ? props.sectionClassName : styles.overskrift}>
        <WarningColored className={props.ikonClassName ? props.ikonClassName : styles.ikon} />
        <BodyShort>{props.tekst}</BodyShort>
    </div>
);
