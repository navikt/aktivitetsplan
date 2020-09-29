import { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { hentBruker, setStatusOk } from '../moduler/bruker/bruker-reducer';
import { hentNivaa4 } from '../moduler/tilgang/tilgang-reducer';

export function fnrFraUrl() {
    const fnrMatch = window.location.pathname.match(`${window.appconfig.CONTEXT_PATH}/(\\d*)`);
    return fnrMatch && fnrMatch[1];
}

class FnrProvider extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        if (window.appconfig.FNR_I_URL) {
            // på innsiden - merk at urlen ikke alltid har et fnr!
            const fnr = fnrFraUrl();
            if (fnr) {
                dispatch(hentBruker(fnr));
                dispatch(hentNivaa4(fnr));
            }
        } else {
            // på utsiden
            dispatch(setStatusOk());
        }
    }

    render() {
        const { children } = this.props;
        return !window.appconfig.FNR_I_URL || fnrFraUrl() ? children : null;
    }
}

FnrProvider.propTypes = {
    children: PT.node.isRequired,
    dispatch: PT.func.isRequired,
};

export default connect()(FnrProvider);
