import React from 'react';
import PT from 'prop-types';
import Tekstomrade from 'nav-frontend-tekstomrade';
import Text from '../../../../text';

function AktivitetIngress({ type }) {
    return (
        <section className="aktivitetingress">
            <Text id={`aktivitetingress.${type}`.toLowerCase()}>
                {ingress =>
                    <Tekstomrade className="aktivitetingress__tekst">
                        {ingress}
                    </Tekstomrade>}
            </Text>
        </section>
    );
}

AktivitetIngress.propTypes = {
    type: PT.string.isRequired,
};

export default AktivitetIngress;
