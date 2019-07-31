import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';

function FieldGroup({ name, field, children }) {
    const { touched, error } = field;
    const feil = touched ? error : null;
    return (
        <div id={name} className={classNames({ 'skjema--harFeil': feil })}>
            <div className={classNames({ skjema__feilomrade: feil })}>
                {children}
                <div
                    role="alert"
                    aria-live="assertive"
                    className="skjemaelement__feilmelding"
                >
                    {feil}
                </div>
            </div>
        </div>
    );
}

FieldGroup.propTypes = {
    name: PT.string.isRequired,
    field: PT.shape({
        touched: PT.bool.isRequired,
        error: PT.string,
    }).isRequired,
    children: PT.node,
};

FieldGroup.defaultProps = {
    children: undefined,
};

export default FieldGroup;
