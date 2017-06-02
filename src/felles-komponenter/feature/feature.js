import PT from 'prop-types';

export default function Feature({ name, children }) {
    const enabled = window.features && window.features[name] === true;
    return enabled ? children : null;
}

Feature.propTypes = {
    name: PT.string.isRequired,
    children: PT.node.isRequired,
};
