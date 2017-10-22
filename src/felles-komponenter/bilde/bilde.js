import React from 'react';
import PT from 'prop-types';

function Bilde({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} />;
}

Bilde.propTypes = {
    src: PT.string.isRequired,
    alt: PT.string.isRequired,
};

export default Bilde;
