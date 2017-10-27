import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { CONTEXT_PATH, FNR_I_URL } from '~config'; // eslint-disable-line
import { RESET_STORE } from '../reducer';
import {
    hentPerson,
    setNAVsomMotpart,
} from '../moduler/motpart/motpart-reducer';
import history from '../history';
import { hentBruker } from '../moduler/bruker/bruker-reducer';

export function fnrFraUrl() {
    const fnrMatch = window.location.pathname.match(`${CONTEXT_PATH}/(\\d*)`);
    return fnrMatch && fnrMatch[1];
}

class FnrProvider extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.listener = () => {
            dispatch(RESET_STORE);
            history.replace('/');
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        if (FNR_I_URL) {
            // e.g. på innsiden - merk at urlen ikke alltid har et fnr!
            const fnr = fnrFraUrl();
            if (fnr) {
                dispatch(hentPerson(fnr));
                dispatch(hentBruker(fnr));
            }
        } else {
            // e.g. på utsiden
            dispatch(setNAVsomMotpart());
        }
        document.addEventListener('flate-person-endret', this.listener);
    }

    componentWillUnmount() {
        document.removeEventListener('flate-person-endret', this.listener);
    }

    render() {
        return (
            <div id="asdfasdfasdfasdfasdf">
                {!FNR_I_URL || fnrFraUrl() ? this.props.children : []}
            </div>
        );
    }
}

FnrProvider.propTypes = {
    children: PT.node.isRequired,
    dispatch: PT.func.isRequired,
};

export default connect()(FnrProvider);
