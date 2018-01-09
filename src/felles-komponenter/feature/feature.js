import PT from 'prop-types';
import {connect} from "react-redux";

export function harFeature(name) {
    const app = window.app;
    let feature = feature[app][name];
    return feature && feature === true;
}

function Feature({ name, children }) {
    return harFeature(name) ? children : null;
}

Feature.propTypes = {
    name: PT.string.isRequired,
    children: PT.node.isRequired,
};

const mapStateToProps = state => ({
    feature: state.data.feature,
});

export default connect(mapStateToProps)(Feature);
