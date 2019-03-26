import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectFeatureData } from './feature-selector';

// Use constants for all features. Makes it easier when cleaning up old toggles.
// Remember to add you feature to 'ALL_FEATURES' which ensures the feature is looked up in unleash.
export const NYENDRINGIAKTIVITET = 'aktivitetsplan.nyendringiaktivitet';
export const MANUELL_REGISTRERING = 'modia.manuell_registrering';
export const ALL_FEATURES = [NYENDRINGIAKTIVITET, MANUELL_REGISTRERING];

export const harFeature = (name, features, reverse) =>
    features[name] === !reverse;

function Feature({ name, children, features, reverse }) {
    return harFeature(name, features, reverse) ? children : null;
}

Feature.propTypes = {
    name: PT.string.isRequired,
    children: PT.node.isRequired,
    reverse: PT.bool,
    features: PT.object,
};

const mapStateToProps = state => ({
    features: selectFeatureData(state),
});

export default connect(mapStateToProps)(Feature);
