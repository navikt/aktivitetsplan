import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { CONTEXT_PATH } from '~config'; // eslint-disable-line
import { RESET_STORE } from '../reducer';
import { hentPerson, setNAVsomMotpart } from '../ducks/motpart';

export function fnrFraUrl() {
    const fnrMatch = window.location.pathname.match(`${CONTEXT_PATH}/(\\d*)`);
    return fnrMatch && fnrMatch[1];
}

class FnrProvider extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        document.addEventListener('flate-person-endret', () => {
            dispatch(RESET_STORE);
            dispatch(hentPerson(fnrFraUrl()));
        });
    }

    componentDidMount() {
        const { dispatch } = this.props;
        const fnr = fnrFraUrl();
        if (fnr) {
            dispatch(hentPerson(fnr));
        } else {
            dispatch(setNAVsomMotpart());
        }
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

FnrProvider.propTypes = {
    children: PT.node.isRequired,
    dispatch: PT.func.isRequired,
};

export default connect()(FnrProvider);
