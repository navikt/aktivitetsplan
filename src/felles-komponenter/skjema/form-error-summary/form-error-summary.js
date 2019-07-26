import React from 'react';
import PT from 'prop-types';

export function Error({ name, error }) {
    return (
        <li key={`${name}-${error}`}>
            <a href={`#${name}`}>
                {error}
            </a>
        </li>
    );
}

Error.propTypes = {
    name: PT.string.isRequired,
    error: PT.string.isRequired,
};

export function FormErrorSummary({ hidden, errors }) {
    if (hidden) {
        return null;
    }

    return (
        <div
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            className="feedbacksummary"
            tabIndex="-1"
        >
            <h3>Fyll ut obligatoriske felt</h3>
            <ul>
                {Object.entries(errors).map(([name, error]) =>
                    <Error key={name} error={error} name={name} />
                )}
            </ul>
        </div>
    );
}

FormErrorSummary.propTypes = {
    errors: PT.object.isRequired,
};

export default FormErrorSummary;
