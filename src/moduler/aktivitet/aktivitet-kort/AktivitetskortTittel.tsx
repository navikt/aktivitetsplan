import classNames from 'classnames';
import { Element } from 'nav-frontend-typografi';
import React from 'react';

import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import NotifikasjonMarkering from '../../../felles-komponenter/utils/NotifikasjonMarkering';
import styles from './Aktivitetskort.module.less';

interface Props {
    aktivitet: Aktivitet;
    harEndring: boolean;
    id: string;
}

export default function Aktivitetskorttittel({ aktivitet, harEndring, id }: Props) {
    return (
        <div className={styles.header}>
            <NotifikasjonMarkering visible={harEndring} />
            <Element tag="h3" id={id} className={classNames(styles.tittel, 'softbreak')}>
                {aktivitet.tittel}
            </Element>
        </div>
    );
}
