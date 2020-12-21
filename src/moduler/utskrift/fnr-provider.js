import PT from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';

import { getFodselsnummer } from '../../utils/fnr-util';
import { hentBruker, setStatusOk } from '../bruker/bruker-reducer';

class FnrProvider extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        if (window.appconfig.FNR_I_URL) {
            // på innsiden - merk at urlen ikke alltid har et fnr!
            const fnr = getFodselsnummer();
            if (fnr) {
                dispatch(hentBruker(fnr));
            }
        } else {
            // på utsiden
            dispatch(setStatusOk());
        }
    }

    render() {
        const { children } = this.props;
        return !window.appconfig.FNR_I_URL || getFodselsnummer() ? children : null;
    }
}

FnrProvider.propTypes = {
    children: PT.node.isRequired,
    dispatch: PT.func.isRequired,
};

export default connect()(FnrProvider);
