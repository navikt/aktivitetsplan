import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString from 'query-string';
import { hentFeature } from './ducks/feature-reducer';

class InitiellDataLast extends Component {
    componentDidMount() {
        const { actions } = this.props;
        const { enhet } = queryString.parse(window.location.search);
        actions.hentFeature(enhet);
    }

    render() {
        const { children } = this.props;
        return (
            <div>
                {children}
            </div>
        );
    }
}

InitiellDataLast.propTypes = {
    children: PT.node.isRequired,
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

export default connect(null, mapDispatchToProps)(InitiellDataLast);
