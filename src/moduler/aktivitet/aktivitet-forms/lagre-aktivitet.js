import React from 'react';
import PT from 'prop-types';
import { Hovedknapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import { selectAktivitetStatus } from '../aktivitet-selector';
import { STATUS } from '../../../ducks/utils';
import { selectErUnderOppfolging } from '../../oppfolging-status/oppfolging-selector';

function LagreAktivitet({ venter, underOppfolging }) {
    return (
        <div className="aktivitetskjema__lagre-knapp">
            <Hovedknapp spinner={venter} disabled={venter || !underOppfolging}>
                Lagre
            </Hovedknapp>
        </div>
    );
}

LagreAktivitet.propTypes = {
    venter: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
};

const mapStateToProps = (state) => {
    const aktivitetStatus = selectAktivitetStatus(state);
    return {
        venter: !(aktivitetStatus === STATUS.OK || aktivitetStatus === STATUS.ERROR),
        underOppfolging: selectErUnderOppfolging(state),
    };
};

export default connect(mapStateToProps)(LagreAktivitet);
