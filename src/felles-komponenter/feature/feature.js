import PT from 'prop-types';

export function harFeature(name) {
    return window.features && window.features[name] === true;
}

export default function Feature({ name, children }) {
    return harFeature(name) ? children : null;
}

Feature.propTypes = {
    name: PT.string.isRequired,
    children: PT.node.isRequired,
};
