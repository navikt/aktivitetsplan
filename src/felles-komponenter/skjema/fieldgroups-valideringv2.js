import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';

function FieldGroup({ name, children, feil }) {
    return (
        <div id={name} className={classNames({ 'skjema--harFeil': feil })}>
            <div className={classNames({ skjema__feilomrade: feil })}>
                {children}
                <div
                    role="alert"
                    aria-live="assertive"
                    className="skjemaelement__feilmelding"
                >
                    {feil && feil.feilmelding}
                </div>
            </div>
        </div>
    );
}

FieldGroup.propTypes = {
    name: PT.string.isRequired,
    children: PT.node,
    feil: PT.node,
};

FieldGroup.defaultProps = {
    children: undefined,
    feil: null,
};

export default FieldGroup;
