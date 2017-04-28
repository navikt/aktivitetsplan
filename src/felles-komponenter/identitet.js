import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { hentIdentitet } from '../ducks/identitet';


class Identitet extends Component {

    componentDidMount() {
        this.props.doHentIdentitet();
    }

    render() {
        const { children, ident } = this.props;
        return (
            <span>{ident === children ? 'deg' : children}</span>
        );
    }

}


Identitet.propTypes = {
    ident: PT.string,
    children: PT.string,

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


export default connect(mapStateToProps, mapDispatchToProps)(Identitet);
