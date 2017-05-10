import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import Tekstomrade from 'nav-frontend-tekstomrade';

function Aktivitetsbeskrivelse({ beskrivelse }) {
    return beskrivelse ? (
        <section className="aktivitetsbeskrivelse">
            <Element className="aktivitetsbeskrivelse__tittel">
                <FormattedMessage id="aktivitetvisning.beskrivelse-label" />
            </Element>
            <Tekstomrade className="aktivitetsbeskrivelse__tekst">{beskrivelse}</Tekstomrade>
        </section>
    ) : null;
}

Aktivitetsbeskrivelse.propTypes = {
    beskrivelse: PT.string
};

Aktivitetsbeskrivelse.defaultProps = {
    beskrivelse: undefined
};

export default Aktivitetsbeskrivelse;
