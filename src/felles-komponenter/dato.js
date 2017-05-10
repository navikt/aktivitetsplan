import React from 'react';
import PT from 'prop-types';
import { formaterDatoTid } from '../utils';

function Dato({ children }) {
    return (
        <span>{formaterDatoTid(children)}</span>
    );
}

Dato.propTypes = {
    children: PT.string
};

Dato.defaultProps = {
    children: undefined
};

export default Dato;
