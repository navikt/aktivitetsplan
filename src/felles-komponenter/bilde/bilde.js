import React, { PropTypes as PT } from 'react';

function Bilde({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} />;
}

Bilde.propTypes = {
    src: PT.string.isRequired,
    alt: PT.string.isRequired,
};

export default Bilde;
