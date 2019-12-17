import * as React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectArenaAktivitetStatus, selectArenaFeilmeldinger } from '../aktivitet/arena-aktivitet-selector';
import { STATUS } from '../../ducks/utils';
import Feilmelding from './feilmelding';
import { selectAktivitetStatus } from '../aktivitet/aktivitet-selector';
import AlertStripe from 'nav-frontend-alertstriper';

function ArenaFeilmelding({ aktivitetStatus, arenaStatus, arenaFeilmeldinger }) {
    const erArenaFeil = aktivitetStatus === STATUS.OK && arenaStatus === STATUS.ERROR;

    //TODO: SLETT!!
    return (
        <div className="container" style={{ marginBottom: '20px' }}>
            <AlertStripe type="info">
                Aktivitetsplanen og dialogen vil være ustabil fra 27. desember til 2. januar på grunn av vedlikehold. Vi
                beklager ulempene.
            </AlertStripe>
        </div>
    );

    // eslint-disable-next-line
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
    // eslint-disable-next-line
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
