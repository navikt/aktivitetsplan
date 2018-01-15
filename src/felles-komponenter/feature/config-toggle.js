import PT from 'prop-types';

export function harConfigToggle(name) {
    return window.features && window.features[name] === true;
}

export default function ConfigToggle({ name, children }) {
    return harConfigToggle(name) ? children : null;
}

ConfigToggle.propTypes = {
    name: PT.string.isRequired,
    children: PT.node.isRequired,
};
