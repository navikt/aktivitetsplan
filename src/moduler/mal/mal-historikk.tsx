import { Accordion, Heading } from '@navikt/ds-react';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Mal } from '../../datatypes/oppfolgingTypes';
import { formaterDatoEllerTidSiden } from '../../utils/dateUtils';
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
        <article key={gjeldendeMal.dato}>
            <span className="font-bold">
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

const MalHistorikk = () => {
    const historiskeMal = useSelector(selectMalListe, shallowEqual);
    const erVeileder = useSelector(selectErVeileder, shallowEqual);

    if (historiskeMal.length === 0) {
        return null;
    }

    return (
        <Accordion>
            <Accordion.Item className="first:border-t-2 first:border-border-divider">
                <Accordion.Header>
                    <Heading level="2" size="small">
                        Tidligere lagrede mål
                    </Heading>
                </Accordion.Header>
                <Accordion.Content>{historiskeMal.map((m: Mal) => malListeVisning(m, erVeileder))}</Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};

export default MalHistorikk;
