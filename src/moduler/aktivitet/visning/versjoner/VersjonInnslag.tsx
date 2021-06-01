import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { useSelector } from 'react-redux';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import BrukeravhengigTekst from '../../../../felles-komponenter/BrukeravhengigTekst';
import { formaterDatoEllerTidSiden } from '../../../../utils';
import { selectErBruker } from '../../../identitet/identitet-selector';
import { endringsTekst } from './versjonTekster';

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
            <Element className="versjon-for-aktivitet-innslag__identitet">
                <BrukeravhengigTekst lagtInnAv={aktivitet.lagtInnAv} endretAv={aktivitet.endretAv} />
                &nbsp;
            </Element>
            {endringsTekst(erBruker, aktivitet, forrigeAktivitet)}
            <Normaltekst>{formaterDatoEllerTidSiden(aktivitet.endretDato)}</Normaltekst>
        </div>
    );
};

export default VersjonInnslag;
