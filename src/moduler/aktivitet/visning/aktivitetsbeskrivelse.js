import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { EtikettLiten } from 'nav-frontend-typografi';
import Normaltekst from 'nav-frontend-typografi/src/normaltekst';

function Aktivitetsbeskrivelse({ beskrivelse }) {
    return beskrivelse
        ? <section className="aktivitetsbeskrivelse">
              <EtikettLiten className="aktivitetsbeskrivelse__tittel">
                  <FormattedMessage id="aktivitetvisning.beskrivelse-label" />
              </EtikettLiten>
              <Normaltekst className="aktivitetsbeskrivelse__tekst">
                  {beskrivelse}
              </Normaltekst>
          </section>
        : null;
}

Aktivitetsbeskrivelse.propTypes = {
    beskrivelse: PT.string,
};

Aktivitetsbeskrivelse.defaultProps = {
    beskrivelse: undefined,
};

export default Aktivitetsbeskrivelse;
