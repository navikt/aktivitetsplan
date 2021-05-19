import React from 'react';
import { useSelector } from 'react-redux';

import { selectErBruker } from '../moduler/identitet/identitet-selector';
import { BrukerType } from '../datatypes/aktivitetTypes';

interface Props {
    lagtInnAv: BrukerType;
    endretAv?: string;
}
// Senere: fjern tekster lagtInnAv.*
const BrukeravhengigTekst = (props: Props) => {
    const { lagtInnAv, endretAv } = props;

    const erBruker = useSelector(selectErBruker);

    let brukeravhengigTekst;

    if (erBruker) {
        if (lagtInnAv === 'BRUKER') {
            brukeravhengigTekst = 'Du';
        } else {
            brukeravhengigTekst = 'NAV';
        }
    } else {
        if (lagtInnAv === 'NAV') {
            brukeravhengigTekst = endretAv ? endretAv : 'NAV';
        } else {
            brukeravhengigTekst = 'Bruker';
        }
    }
    return <>{brukeravhengigTekst}</>
};

export default BrukeravhengigTekst;
