import { Element } from 'nav-frontend-typografi';
import React from 'react';
import classNames from 'classnames';
import NotifikasjonMarkering from '../../../felles-komponenter/utils/notifikasjon-markering';
import styles from './Aktivitetskort.module.less';
import { Aktivitet } from '../../../types';

interface Props {
    aktivitet: Aktivitet;
    harEndring: boolean;
    id: string;
}

export default function Aktivitetskorttittel({ aktivitet, harEndring, id }: Props) {
    return (
        <div className={styles.header}>
            <NotifikasjonMarkering visible={harEndring} />
            <Element tag="h1" id={id} className={classNames(styles.tittel, 'softbreak')}>
                {aktivitet.tittel}
            </Element>
        </div>
    );
}
