import React, { PropTypes as PT } from 'react';
import { Normaltekst, EtikettLiten } from 'nav-frontend-typografi';

function Aktivitetsbeskrivelse({ beskrivelse }) {
    return beskrivelse ? (
        <section className="aktivitetsbeskrivelse">
            <EtikettLiten className="aktivitetsbeskrivelse__tittel">Beskrivelse</EtikettLiten>
            <Normaltekst>{beskrivelse}</Normaltekst>
        </section>
    ) : null;
}

Aktivitetsbeskrivelse.propTypes = {
    beskrivelse: PT.string
};

export default Aktivitetsbeskrivelse;
