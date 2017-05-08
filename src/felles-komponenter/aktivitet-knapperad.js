import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import { Hovedknapp, Knapp } from 'nav-react-design/dist/knapp';

const aktivitetKnapperadCls = (className) => classNames('aktivitet-knapperad', className);

function AktivitetKnapperad({ className, handterRediger, handterSlett }) {
    return (
        <section className={aktivitetKnapperadCls(className)}>
            <Hovedknapp
                className="rad-knapp"
                onClick={handterRediger}
            >
                Rediger
            </Hovedknapp>
            <Knapp
                className="rad-knapp"
                onClick={handterSlett}
            >
                Slett
            </Knapp>
        </section>
    );
}

AktivitetKnapperad.propTypes = {
    className: PT.string,
    handterRediger: PT.func.isRequired,
    handterSlett: PT.func.isRequired
};

AktivitetKnapperad.defaultProps = {
    className: undefined
};

export default AktivitetKnapperad;
