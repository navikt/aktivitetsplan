import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Mal } from '../../datatypes/oppfolgingTypes';
import EkspanderbarLinje from '../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinje';
import { formaterDatoEllerTidSiden } from '../../utils';
import CustomBodyLong from '../aktivitet/visning/hjelpekomponenter/CustomBodyLong';
import { selectErVeileder } from '../identitet/identitet-selector';
import { selectMalListe } from './aktivitetsmal-selector';

const identitetMap = (erVeileder: boolean, endretAv: string) => {
    if (erVeileder) {
        return endretAv === 'BRUKER' ? 'bruker' : 'NAV';
    }
    return endretAv === 'BRUKER' ? 'deg' : 'NAV';
};

function malListeVisning(gjeldendeMal: Mal, erVeileder: boolean) {
    return (
        <article key={gjeldendeMal.dato} className="aktivitetmal__historikk">
            <span className="aktivitetmal__historikk-skrevetav">
                {gjeldendeMal.mal ? 'Skrevet av ' : 'Mål slettet av '}
                <span>{identitetMap(erVeileder, gjeldendeMal.endretAv)}</span>
            </span>
            {` ${formaterDatoEllerTidSiden(gjeldendeMal.dato)}`}
            <CustomBodyLong formatLinebreaks formatLinks>
                {gjeldendeMal.mal}
            </CustomBodyLong>
        </article>
    );
}

function MalHistorikk() {
    const historiskeMal = useSelector(selectMalListe, shallowEqual);
    const erVeileder = useSelector(selectErVeileder, shallowEqual);

    if (historiskeMal.length === 0) {
        return null;
    }

    return (
        <>
            <hr className="aktivitetmal__delelinje" />
            <EkspanderbarLinje tittel="Tidligere lagrede mål" kanToogle aapneTekst="Åpne" lukkeTekst="Lukk">
                {historiskeMal.map((m: Mal) => malListeVisning(m, erVeileder))}
            </EkspanderbarLinje>
        </>
    );
}

export default MalHistorikk;
