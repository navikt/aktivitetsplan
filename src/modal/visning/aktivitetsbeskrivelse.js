import React, { PropTypes as PT } from 'react';
import { Normaltekst, Element } from 'nav-frontend-typografi';

function Aktivitetsbeskrivelse({ beskrivelse }) {
    return beskrivelse ? (
        <section className="aktivitetsbeskrivelse">
            <Element className="aktivitetsbeskrivelse__tittel">Beskrivelse</Element>
            <Normaltekst className="aktivitetsbeskrivelse__tekst">{beskrivelse}</Normaltekst>
        </section>
    ) : null;
}

Aktivitetsbeskrivelse.propTypes = {
    beskrivelse: PT.string
};

export default Aktivitetsbeskrivelse;
