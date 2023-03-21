import { Detail } from '@navikt/ds-react';
import React from 'react';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { getAktivitetType } from '../../../utils/textMappers';
import styles from './Aktivitetskort.module.less';

interface Props {
    aktivitet: AlleAktiviteter;
}

const Aktivitetstype = ({ aktivitet }: Props) => (
    <Detail as="p" className={styles.type} data-testid={aktivitet.type}>
        {getAktivitetType(aktivitet)}
    </Detail>
);

export default Aktivitetstype;
