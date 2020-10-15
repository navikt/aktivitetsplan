import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hentFeature } from './ducks/feature-reducer';

function getEnhetFromURL() {
    const queryString = window.location.search;
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    const maybeEnhet = pairs.find((val) => val.startsWith('enhet='));
    if (maybeEnhet) {
        const enhet = maybeEnhet.substring(6);
        return enhet === '' ? undefined : enhet;
    }

    return undefined;
}

class InitiellDataLast extends Component {
    componentDidMount() {
        const { actions } = this.props;
        actions.hentFeature(getEnhetFromURL());
    }

    render() {
        const { children } = this.props;
        return <div>{children}</div>;
    }
}

InitiellDataLast.propTypes = {
    children: PT.node.isRequired,
    actions: PT.objectOf(PT.func).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            hentFeature,
        },
        dispatch
    ),
});

export default connect(null, mapDispatchToProps)(InitiellDataLast);
