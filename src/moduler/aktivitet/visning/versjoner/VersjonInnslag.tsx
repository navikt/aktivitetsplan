import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { useSelector } from 'react-redux';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { formaterDatoEllerTidSiden } from '../../../../utils';
import { selectErBruker } from '../../../identitet/identitet-selector';
import Endringstekst from './Endringstekst';

interface Props {
    aktivitet: Aktivitet;
    forrigeAktivitet?: Aktivitet;
}

// Senere:  fjerne tekster 'endringstype.*'
const VersjonInnslag = (props: Props) => {
    const { aktivitet, forrigeAktivitet } = props;
    const erBruker = useSelector(selectErBruker);

    return (
        <div className="versjon-for-aktivitet-innslag">
            <Endringstekst aktivitet={aktivitet} erBruker={erBruker} forrigeAktivitet={forrigeAktivitet} />
            <Normaltekst>{formaterDatoEllerTidSiden(aktivitet.endretDato)}</Normaltekst>
        </div>
    );
};

export default VersjonInnslag;
