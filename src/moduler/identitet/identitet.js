import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { hentIdentitet } from './identitet-reducer';

class Identitet extends Component {
    componentDidMount() {
        const { doHentIdentitet } = this.props;
        doHentIdentitet();
    }

    render() {
        const { children, ident } = this.props;
        return <span>{ident === children ? 'deg' : children}</span>;
    }
}

Identitet.propTypes = {
    ident: PT.string,
    children: PT.string,
    doHentIdentitet: PT.func.isRequired
};

Identitet.defaultProps = {
    ident: undefined,
    children: undefined
};

const mapStateToProps = state => {
    const ident = state.data.identitet.data.id;
    return {
        ident
    };
};

const mapDispatchToProps = dispatch => ({
    doHentIdentitet: () => dispatch(hentIdentitet())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Identitet);
