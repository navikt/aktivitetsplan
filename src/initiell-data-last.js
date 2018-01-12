import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Innholdslaster from './felles-komponenter/utils/innholdslaster';
import { hentFeature } from './ducks/feature-reducer';
import { hentLedetekster } from './ducks/ledetekster-reducer';

class InitiellDataLast extends Component {
    componentDidMount() {
        this.props.actions.hentLedetekster();
        this.props.actions.hentFeature();
    }

    render() {
        const { children, ledetekster, features } = this.props;
        return (
            <div>
                <Innholdslaster avhengigheter={[ledetekster, features]}>
                    {children}
                </Innholdslaster>
            </div>
        );
    }
}

InitiellDataLast.propTypes = {
    children: PT.node.isRequired,
    actions: PT.objectOf(PT.func).isRequired,
    ledetekster: PT.shape({
        status: PT.string.isRequired,
        data: PT.object,
    }).isRequired,
    features: PT.shape({
        status: PT.string.isRequired,
        data: PT.object,
    }).isRequired,
};

const mapStateToProps = state => ({
    ledetekster: state.data.ledetekster,
    features: state.data.feature,
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
