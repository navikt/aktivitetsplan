import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { endringsTekst } from './versjonTekster';
import BrukeravhengigTekst from '../../../../felles-komponenter/BrukeravhengigTekst';
import { formaterDatoEllerTidSiden } from '../../../../utils';

interface Props {
    versjon: Aktivitet,
    prevVersjon?: Aktivitet
}

// Senere: fjerne tekster 'endringstype.*'
const VersjonInnslag = (props: Props) => {
    const {versjon, prevVersjon} = props;

    return (
        <div className="versjon-for-aktivitet-innslag">
            <Element className="versjon-for-aktivitet-innslag__identitet">
                <BrukeravhengigTekst lagtInnAv={versjon.lagtInnAv} endretAv={versjon.endretAv} />
                &nbsp;
            </Element>
            {endringsTekst(versjon, prevVersjon)}
            <Normaltekst>{formaterDatoEllerTidSiden(versjon.endretDato)}</Normaltekst>
        </div>
    );
}

export default VersjonInnslag;


