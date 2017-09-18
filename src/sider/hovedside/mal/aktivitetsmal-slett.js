import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import BekreftSlettVisning from '../../../moduler/aktivitet/visning/bekreft-slett-visning/bekreft-slett-visning';
import history from '../../../history';
import { slettMal } from '../../../moduler/mal/mal-reducer';
import AktivitetsmalModal from './aktivitetsmal-modal';
import { selectMalListe } from '../../../moduler/mal/mal-selector';
import * as AppPT from '../../../proptypes';

// denne brukes i routing og må da være component
// eslint-disable-next-line react/prefer-stateless-function
class AktivitetmalSlett extends Component {
    render() {
        const { doSlettMal, malData } = this.props;
        const bekrefSlettingAvMalListe =
            malData.length > 1
                ? 'aktivitetsmal.bekreft-sletting.undertittel'
                : null;
        return (
            <BekreftSlettVisning
                slettAction={() => {
                    doSlettMal();
                    history.push('/mal');
                }}
                avbrytAction={() => history.push('/mal')}
                tittelId="aktivitetsmal.bekreft-sletting.tittel"
                undertekstId={bekrefSlettingAvMalListe}
            />
        );
    }
}

AktivitetmalSlett.propTypes = {
    doSlettMal: PT.func.isRequired,
    malData: PT.arrayOf(AppPT.mal).isRequired,
};

const mapStateToProps = state => ({
    malData: selectMalListe(state),
});

const mapDispatchToProps = dispatch => ({
    doSlettMal: () => dispatch(slettMal()),
});

export default AktivitetsmalModal(
    connect(mapStateToProps, mapDispatchToProps)(AktivitetmalSlett)
);
