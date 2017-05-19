import React from 'react';
import PT from 'prop-types';
import { formaterDatoTid, formaterDato } from '../utils';

function Dato({ visTidspunkt, children, ...resten }) {
    return (
        <span {...resten}>{visTidspunkt ? formaterDatoTid(children) : formaterDato(children)}</span>
    );
}

Dato.propTypes = {
    children: PT.string,
    visTidspunkt: PT.bool
};

Dato.defaultProps = {
    children: undefined,
    visTidspunkt: false
};

export default Dato;
