import React, { PropTypes as PT } from 'react';
import Lenke from './lenke';

function Lenkeknapp({ onClick, ...rest }) {
    function click(e) {
        e.preventDefault();
        onClick(e);
    }

    return (
        <Lenke {...rest} href="#" onClick={click} />
    );
}

Lenkeknapp.propTypes = {
    onClick: PT.func.isRequired
};

export default Lenkeknapp;
