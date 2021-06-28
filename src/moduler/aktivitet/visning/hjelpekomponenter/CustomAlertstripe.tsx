import { Element } from 'nav-frontend-typografi';
import React from 'react';

import { ReactComponent as VarselIkon } from '../../../../Ikoner/advarsel-ikon.svg';
import styles from './CustomAlertstripe.module.less';

interface Props {
    tekst: string;
    sectionClassName?: string;
    textClassName?: string;
}

export const CustomAlertstripe = (props: Props) => {
    return (
        <div className={props.sectionClassName ? props.sectionClassName : styles.overskrift}>
            <VarselIkon />
            <Element className={props.textClassName ? props.textClassName : styles.tekst}>{props.tekst}</Element>
        </div>
    );
};
