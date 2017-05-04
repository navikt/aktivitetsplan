import React, { Component, PropTypes as PT } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { hentIdentitet } from '../ducks/identitet';

class Identitet extends Component {

    componentDidMount() {
        this.props.doHentIdentitet();
    }

    render() {
        const { children, ident } = this.props;
        return (
            <span>{ident === children ? this.props.intl.formatMessage({ id: 'idenditet.deg' }) : children}</span>
        );
    }
}

Identitet.propTypes = {
    ident: PT.string,
    children: PT.string,
    intl: intlShape,
    doHentIdentitet: PT.func.isRequired
};

const mapStateToProps = (state) => {
    const ident = state.data.identitet.data.id;
    return {
        ident
    };
};

const mapDispatchToProps = (dispatch) => ({
    doHentIdentitet: () => dispatch(hentIdentitet())
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Identitet));
