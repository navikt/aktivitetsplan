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

Dato.defaultProps = {
    children: undefined
};

export default Dato;
