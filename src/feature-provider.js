import { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hentFeature } from './ducks/feature-api';

class FeatureProvider extends Component {
    componentDidMount() {
        this.props.actions.hentFeature();
    }

    render() {
        return null;
    }
}

FeatureProvider.propTypes = {
    actions: PT.objectOf(PT.func).isRequired,
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            hentFeature,
        },
        dispatch
    ),
});

export default connect(mapDispatchToProps)(FeatureProvider);
