import React from 'react';
import PT from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import Tekstomrade from 'nav-frontend-tekstomrade';

function AktivitetIngress({ type, intl }) {
    const ingress = intl.formatMessage({
        id: `aktivitetingress.${type}`.toLowerCase(),
        defaultMessage: 'IKKE_SPESIFISERT',
    });
    return ingress !== 'IKKE_SPESIFISERT'
        ? <section className="aktivitetingress">
              <Tekstomrade className="aktivitetingress__tekst">
                  {ingress}
              </Tekstomrade>
          </section>
        : null;
}

AktivitetIngress.propTypes = {
    type: PT.string.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(AktivitetIngress);
