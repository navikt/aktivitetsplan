import PT from 'prop-types';
import { connect } from 'react-redux';

export function harFeature(name, features) {
    const app = window.app;
    const feature = features && features[app] && features[app][name];
    return feature && feature === true;
}

function Feature({ name, children, features }) {
    return harFeature(name, features) ? children : null;
}

Feature.propTypes = {
    name: PT.string.isRequired,
    children: PT.node.isRequired,
    features: PT.object,
};

const mapStateToProps = state => ({
    features: state.data.feature.data,
});

export default connect(mapStateToProps)(Feature);
