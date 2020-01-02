import * as React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectArenaAktivitetStatus, selectArenaFeilmeldinger } from '../aktivitet/arena-aktivitet-selector';
import { STATUS } from '../../ducks/utils';
import Feilmelding from './feilmelding';
import { selectAktivitetStatus } from '../aktivitet/aktivitet-selector';

function ArenaFeilmelding({ aktivitetStatus, arenaStatus, arenaFeilmeldinger }) {
    const erArenaFeil = aktivitetStatus === STATUS.OK && arenaStatus === STATUS.ERROR;
    if (erArenaFeil) {
        return (
            <Feilmelding
                feilmeldinger={arenaFeilmeldinger}
                erArenaFeil={erArenaFeil}
                className="container"
                id={arenaFeilmeldinger}
            />
        );
    }
    return null;
}
ArenaFeilmelding.defaultProps = {
    arenaFeilmeldinger: []
};

ArenaFeilmelding.propTypes = {
    arenaFeilmeldinger: PT.array,
    arenaStatus: PT.string.isRequired,
    aktivitetStatus: PT.string.isRequired
};

const mapStateToProps = state => ({
    aktivitetStatus: selectAktivitetStatus(state),
    arenaStatus: selectArenaAktivitetStatus(state),
    arenaFeilmeldinger: selectArenaFeilmeldinger(state)
});

export default connect(mapStateToProps)(ArenaFeilmelding);
