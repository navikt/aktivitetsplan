import React from 'react';

export const Feature = ({ name, children }) => {
    const enabled = window.features && window.features[name] === true;
    return enabled && <div>{children}</div>;
};

export default Feature;
