import { Heading } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import NotifikasjonMarkering from '../../../felles-komponenter/utils/NotifikasjonMarkering';
import styles from './Aktivitetskort.module.less';

interface Props {
    aktivitet: AlleAktiviteter;
    harEndring: boolean;
    id: string;
}

export default function Aktivitetskorttittel({ aktivitet, harEndring, id }: Props) {
    return (
        <div className={styles.header}>
            <NotifikasjonMarkering visible={harEndring} />
            <Heading level="3" id={id} className={classNames(styles.tittel, 'softbreak')} size="xsmall">
                {aktivitet.tittel}
            </Heading>
        </div>
    );
}
