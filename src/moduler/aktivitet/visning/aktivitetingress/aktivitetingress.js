import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Tekstomrade from 'nav-frontend-tekstomrade';

function AktivitetIngress({ type }) {
    return (
        <section className="aktivitetingress">
            <FormattedMessage id={`aktivitetingress.${type}`.toLowerCase()}>
                {ingress =>
                    <Tekstomrade className="aktivitetingress__tekst">
                        {ingress}
                    </Tekstomrade>}
            </FormattedMessage>
        </section>
    );
}

AktivitetIngress.propTypes = {
    type: PT.string.isRequired,
};

export default AktivitetIngress;
