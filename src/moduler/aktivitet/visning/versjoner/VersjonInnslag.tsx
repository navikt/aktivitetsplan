import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { endringsTekst } from './versjonTekster';
import BrukeravhengigTekst from '../../../../felles-komponenter/BrukeravhengigTekst';
import { formaterDatoEllerTidSiden } from '../../../../utils';

interface Props {
    aktivitet: Aktivitet,
    forrigeAktivitet?: Aktivitet
}

// Senere: fjerne tekster 'endringstype.*'
const VersjonInnslag = (props: Props) => {
    const {aktivitet, forrigeAktivitet} = props;

    return (
        <div className="versjon-for-aktivitet-innslag">
            <Element className="versjon-for-aktivitet-innslag__identitet">
                <BrukeravhengigTekst lagtInnAv={aktivitet.lagtInnAv} endretAv={aktivitet.endretAv} />
                &nbsp;
            </Element>
            {endringsTekst(aktivitet, forrigeAktivitet)}
            <Normaltekst>{formaterDatoEllerTidSiden(aktivitet.endretDato)}</Normaltekst>
        </div>
    );
}

export default VersjonInnslag;


