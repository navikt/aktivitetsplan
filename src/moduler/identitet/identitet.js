import React, { Component } from 'react';
import PT from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { hentIdentitet } from './identitet-reducer';

class Identitet extends Component {
    componentDidMount() {
        const { doHentIdentitet } = this.props;
        doHentIdentitet();
    }

    render() {
        const { children, ident, intl } = this.props;
        return (
            <span>
                {ident === children
                    ? intl.formatMessage({ id: 'identitet.deg' })
                    : children}
            </span>
        );
    }
}

Identitet.propTypes = {
    ident: PT.string,
    children: PT.string,
    intl: intlShape.isRequired,
    doHentIdentitet: PT.func.isRequired,
};

Identitet.defaultProps = {
    ident: undefined,
    children: undefined,
};

const mapStateToProps = state => {
    const ident = state.data.identitet.data.id;
    return {
        ident,
    };
};

const mapDispatchToProps = dispatch => ({
    doHentIdentitet: () => dispatch(hentIdentitet()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(Identitet)
);
