import * as React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectAktivitetListeFeilMelding } from '../aktivitet/aktivitetliste-selector';
import { selectIdentitetFeilMelding } from '../identitet/identitet-selector';
import { selectOppfolgingFeilmeldinger } from '../oppfolging-status/oppfolging-selector';
import Feilmelding from './feilmelding';

function HovedsideFeilmelding({ hovedsidefeilmeldinger }) {
    return (
        <Feilmelding
            feilmeldinger={hovedsidefeilmeldinger}
            className="container"
        />
    );
}

const mapStateToProps = state => {
    const oppfolgingFeilmeldinger = selectOppfolgingFeilmeldinger(state);
    const identitetFeilmeldinger = selectIdentitetFeilMelding(state);
    const feiliArenaOgAktivitet = selectAktivitetListeFeilMelding(state);
    return {
        hovedsidefeilmeldinger: oppfolgingFeilmeldinger.concat(
            identitetFeilmeldinger,
            feiliArenaOgAktivitet
        ),
    };
};

HovedsideFeilmelding.defaultProps = {
    hovedsidefeilmeldinger: [],
};

HovedsideFeilmelding.propTypes = {
    hovedsidefeilmeldinger: PT.array,
};

export default connect(mapStateToProps)(HovedsideFeilmelding);
