import React, { PropTypes as PT } from 'react';
import { formaterDatoTid } from '../utils';

function Dato({ children }) {
    return (
        <span>{formaterDatoTid(children)}</span>
    );
}

Dato.propTypes = {
    children: PT.string
};

export default Dato;
