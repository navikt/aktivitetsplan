import React from 'react';
import PT from 'prop-types';

export default function Feature({ name, children }) {
    const enabled = window.features && window.features[name] === true;
    return enabled ? <div>{children}</div> : null;
}

Feature.propTypes = {
    name: PT.string.isRequired,
    children: PT.node.isRequired,
};
