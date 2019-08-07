import React, { useEffect, useRef } from 'react';
import PT from 'prop-types';

function Error({ name, error }) {
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

function FormErrorSummary({ hidden, errors }) {
    const summaryRef = useRef(null);

    // focus on summary ref when shown
    useEffect(
        () => {
            if (!hidden) {
                summaryRef.current.focus();
            }
        },
        [hidden, summaryRef]
    );

    if (hidden) {
        return null;
    }

    return (
        <div
            ref={summaryRef}
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
    hidden: PT.bool.isRequired,
    errors: PT.object.isRequired,
};

export default FormErrorSummary;
