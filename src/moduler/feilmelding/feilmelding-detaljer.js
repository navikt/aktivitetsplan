import React from 'react';
import PT from 'prop-types';

function FeilmeldingDetaljer({ feilId, action, httpStatus, detaljertType, feilMelding, stackTrace }) {
    return (
        <div>
            <div>{feilId}</div>
            <div>{action}</div>
            <div>{httpStatus}</div>
            <div>{detaljertType}</div>
            <h2>{feilMelding}</h2>
            <pre>{stackTrace}</pre>
        </div>
    );
}

FeilmeldingDetaljer.defaultProps = {
    feilId: null,
    action: null,
    httpStatus: null,
    detaljertType: null,
    feilMelding: null,
    stackTrace: null,
};

FeilmeldingDetaljer.propTypes = {
    feilId: PT.string,
    action: PT.string,
    httpStatus: PT.number,
    detaljertType: PT.string,
    feilMelding: PT.string,
    stackTrace: PT.string,
};

export default FeilmeldingDetaljer;
