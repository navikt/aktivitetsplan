import { Undertekst } from 'nav-frontend-typografi';
import React from 'react';

import { AktivitetType } from '../../../datatypes/aktivitetTypes';
import { aktivitetTypeMap } from '../../../utils/textMappers';
import styles from './Aktivitetskort.module.css';

interface Props {
    type: AktivitetType;
}

const Aktivitetstype = ({ type }: Props) => (
    <Undertekst tag="p" className={styles.type} data-testid={type}>
        {aktivitetTypeMap[type]}
    </Undertekst>
);

export default Aktivitetstype;
