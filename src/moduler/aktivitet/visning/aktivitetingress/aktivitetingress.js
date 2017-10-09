import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import Tekstomrade from 'nav-frontend-tekstomrade';
import Text from '../../../../text';

function AktivitetIngress({ type, className }) {
    return (
        <section className={classNames('aktivitetingress', className)}>
            <Text id={`aktivitetingress.${type}`.toLowerCase()}>
                {ingress =>
                    <Tekstomrade className="aktivitetingress__tekst">
                        {ingress}
                    </Tekstomrade>}
            </Text>
        </section>
    );
}

AktivitetIngress.defaultProps = {
    className: '',
};

AktivitetIngress.propTypes = {
    type: PT.string.isRequired,
    className: PT.string,
};

export default AktivitetIngress;
