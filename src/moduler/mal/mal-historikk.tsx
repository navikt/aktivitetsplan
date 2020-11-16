import Lesmerpanel from 'nav-frontend-lesmerpanel';
import Tekstomrade from 'nav-frontend-tekstomrade';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Mal } from '../../types';
import { formaterDatoEllerTidSiden } from '../../utils';
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
            <Tekstomrade className="aktivitetmal__historikk-tekst">{gjeldendeMal.mal || ''}</Tekstomrade>
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
            <div className="aktivitetmal__footer">
                <Lesmerpanel className="" lukkTekst="Skjul tidligere lagrede mål" apneTekst="Vis tidligere lagrede mål">
                    {historiskeMal.map((m: Mal) => malListeVisning(m, erVeileder))}
                </Lesmerpanel>
            </div>
        </>
    );
}

export default MalHistorikk;
