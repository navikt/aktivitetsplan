import { Undertekst } from 'nav-frontend-typografi';
import React from 'react';

import { AktivitetType } from '../../../datatypes/aktivitetTypes';
import styles from './Aktivitetskort.module.less';

export const getType = (type: AktivitetType) => {
    switch (type.toLowerCase()) {
        case 'behandling':
            return 'Behandling';
        case 'egen':
            return 'Jobbrettet egenaktivitet';
        case 'gruppeaktivitet':
            return 'Gruppeaktivitet';
        case 'ijobb':
            return 'Jobb jeg har nå';
        case 'mote':
            return 'Møte med NAV';
        case 'samtalereferat':
            return 'Samtalereferat';
        case 'sokeavtale':
            return 'Jobbsøking';
        case 'stilling':
            return 'Stilling';
        case 'tiltaksaktivitet':
            return 'Tiltak gjennom NAV';
        case 'utdanningsaktivitet':
            return 'Utdanning';
    }
};

interface Props {
    type: AktivitetType;
}

const Aktivitetstype = ({ type }: Props) => (
    <Undertekst tag="p" className={styles.type} data-testid={type}>
        {getType(type)}
    </Undertekst>
);

export default Aktivitetstype;
