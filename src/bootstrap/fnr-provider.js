import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { CONTEXT_PATH, FNR_I_URL } from '~config'; // eslint-disable-line
import { hentBruker } from '../moduler/bruker/bruker-reducer';
import { selectBrukerStatus } from '../moduler/bruker/bruker-selector';
import { STATUS } from '../ducks/utils';

export function fnrFraUrl() {
    const fnrMatch = window.location.pathname.match(`${CONTEXT_PATH}/(\\d*)`);
    return fnrMatch && fnrMatch[1];
}

class FnrProvider extends Component {
    componentDidMount() {
        const { dispatch, brukerstatus } = this.props;
        if (FNR_I_URL) {
            // e.g. på innsiden - merk at urlen ikke alltid har et fnr!
            const fnr = fnrFraUrl();
            if (fnr && brukerstatus !== STATUS.OK) {
                dispatch(hentBruker(fnr));
            }
        }
    }

    render() {
        return (
            <div >
                {!FNR_I_URL || fnrFraUrl() ? this.props.children : []}
            </div>
        );
    }
}

FnrProvider.propTypes = {
    children: PT.node.isRequired,
    dispatch: PT.func.isRequired,
    brukerstatus: PT.string.isRequired,
};
const mapStateToProps = state => ({
    brukerstatus: selectBrukerStatus(state),
});


export default connect(mapStateToProps)(FnrProvider);
