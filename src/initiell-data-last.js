import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Innholdslaster from './felles-komponenter/utils/innholdslaster';
import { hentFeature } from './ducks/feature-reducer';
import { hentLedetekster } from './ducks/ledetekster-reducer';
import { selectFeatureStatus } from './felles-komponenter/feature/feature-selector';
import { selectLedeteksterStatus } from './ducks/ledetekster-selector';

class InitiellDataLast extends Component {
    componentDidMount() {
        this.props.actions.hentLedetekster();
        this.props.actions.hentFeature();
    }

    render() {
        const { children, ledeteksterStatus, featureStatus } = this.props;
        return (
            <div>
                <Innholdslaster
                    avhengigheter={[ledeteksterStatus, featureStatus]}
                >
                    {children}
                </Innholdslaster>
            </div>
        );
    }
}

InitiellDataLast.propTypes = {
    children: PT.node.isRequired,
    actions: PT.objectOf(PT.func).isRequired,
    ledeteksterStatus: PT.string.isRequired,
    featureStatus: PT.string.isRequired,
};

const mapStateToProps = state => ({
    ledeteksterStatus: selectLedeteksterStatus(state),
    featureStatus: selectFeatureStatus(state),
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            hentLedetekster,
            hentFeature,
        },
        dispatch
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(InitiellDataLast);
