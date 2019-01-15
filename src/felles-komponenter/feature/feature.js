import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectFeatureData } from './feature-selector';

// Use constants for all features. Makes it easier when cleaning up old toggles.
// Remember to add you feature to 'ALL_FEATURES' which ensures the feature is looked up in unleash.
export const BRUKERVILKAR = 'aktivitetsplan.brukervilkar';
export const VERKTOYLINJE = 'aktivitetsplan.verktoylinje';
export const FORHANDSORIENTERING = 'aktivitetsplan.forhandsorientering';
export const SKRUAVPRIVATMODUS = 'aktivitetsplan.skruavprivatmodus';
export const NYENDRINGIAKTIVITET = 'aktivitetsplan.nyendringiaktivitet';
export const ALL_FEATURES = [
    BRUKERVILKAR,
    VERKTOYLINJE,
    FORHANDSORIENTERING,
    SKRUAVPRIVATMODUS,
    NYENDRINGIAKTIVITET,
];

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
