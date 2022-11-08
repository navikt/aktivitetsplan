import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { formaterDatoEllerTidSiden } from '../../../../utils';
import Endringstekst from './Endringstekst';
import styles from './VersjonInnslag.module.less';

interface Props {
    aktivitet: VeilarbAktivitet;
    forrigeAktivitet?: VeilarbAktivitet;
}

const VersjonInnslag = (props: Props) => {
    const { aktivitet, forrigeAktivitet } = props;

    return (
        <div className={styles.versjonForAktivitetInnslag}>
            <Endringstekst aktivitet={aktivitet} forrigeAktivitet={forrigeAktivitet} />
            <Normaltekst>{formaterDatoEllerTidSiden(aktivitet.endretDato)}</Normaltekst>
        </div>
    );
};

export default VersjonInnslag;
