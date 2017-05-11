import React from 'react';

export default function Feature({ name, children }) {
    const enabled = window.features && window.features[name] === true;
    return enabled ? <div>{children}</div> : null;
}

