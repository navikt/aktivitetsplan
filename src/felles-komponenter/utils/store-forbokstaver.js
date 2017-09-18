import React from 'react';
import PT from 'prop-types';
import { storeForbokstaver } from '../../utils';

function StoreForbokstaver(streng) {
    return (
        <span>
            {storeForbokstaver(streng)}
        </span>
    );
}

StoreForbokstaver.propTypes = {
    streng: PT.string.isRequired,
};

export default StoreForbokstaver;
