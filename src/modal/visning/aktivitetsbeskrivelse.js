import React, { PropTypes as PT } from 'react';
import { FormatedMessage } from 'react-intl';
import { Normaltekst, Element } from 'nav-frontend-typografi';

function Aktivitetsbeskrivelse({ beskrivelse }) {
    return beskrivelse ? (
        <section className="aktivitetsbeskrivelse">
            <Element className="aktivitetsbeskrivelse__tittel">
                <FormatedMessage id="aktivitetvisning.beskrivelse-label" />
            </Element>
            <Normaltekst className="aktivitetsbeskrivelse__tekst">{beskrivelse}</Normaltekst>
        </section>
    ) : null;
}

Aktivitetsbeskrivelse.propTypes = {
    beskrivelse: PT.string
};

export default Aktivitetsbeskrivelse;
