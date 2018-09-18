import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectFeatureData } from './feature-selector';

export const BRUKERVILKAR = 'brukervilkar';

export function harFeature(name, features) {
    const app = window.app;
    const feature = features && features[app] && features[app][name];
    return !!feature && feature === true;
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
    features: selectFeatureData(state),
});

export default connect(mapStateToProps)(Feature);
