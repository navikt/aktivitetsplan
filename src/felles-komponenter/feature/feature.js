import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectFeatureData } from './feature-selector';

// Use constants for all features. Makes it easier when cleaning up old toggles.
// Remember to add you feature to 'ALL_FEATURES' which ensures the feature is looked up in unleash.
export const BRUKERVILKAR = 'aktivitetsplan.brukervilkar';
export const NYENDRINGIAKTIVITET = 'aktivitetsplan.nyendringiaktivitet';
export const NY_LAYOUT = 'modia.layout_med_visittkort';
export const ALL_FEATURES = [BRUKERVILKAR, NYENDRINGIAKTIVITET, NY_LAYOUT];

export const harFeature = (name, features) => features[name] === true;

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
