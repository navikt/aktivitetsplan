import { Undertekst } from 'nav-frontend-typografi';
import React from 'react';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { getAktivitetType } from '../../../utils/textMappers';
import styles from './Aktivitetskort.module.less';

interface Props {
    aktivitet: AlleAktiviteter;
}

const Aktivitetstype = ({ aktivitet }: Props) => (
    <Undertekst tag="p" className={styles.type} data-testid={aktivitet.type}>
        {getAktivitetType(aktivitet)}
    </Undertekst>
);

export default Aktivitetstype;
