import { Element } from 'nav-frontend-typografi';
import React from 'react';

import { ReactComponent as VarselIkon } from '../../../../Ikoner/advarsel-ikon.svg';
import styles from './CustomAlertstripe.module.css';

interface Props {
    tekst: string;
    sectionClassName?: string;
    ikonClassName?: string;
}

export const CustomAlertstripe = (props: Props) => (
    <div className={props.sectionClassName ? props.sectionClassName : styles.overskrift}>
        <VarselIkon className={props.ikonClassName ? props.ikonClassName : styles.ikon} />
        <Element>{props.tekst}</Element>
    </div>
);
