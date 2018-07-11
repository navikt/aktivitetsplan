import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import BekreftSlettVisning from '../aktivitet/visning/bekreft-slett-visning/bekreft-slett-visning';
import { slettMal } from './aktivitetsmal-reducer';
import AktivitetsmalModal from './aktivitetsmal-modal';
import { selectMalListe } from './aktivitetsmal-selector';
import * as AppPT from '../../proptypes';

// denne brukes i routing og må da være component
// eslint-disable-next-line react/prefer-stateless-function
class AktivitetmalSlett extends Component {
    render() {
        const { doSlettMal, malData, history } = this.props;
        const bekrefSlettingAvMalListe =
            malData.length > 1
                ? 'aktivitetsmal.bekreft-sletting.undertittel'
                : null;
        return (
            <BekreftSlettVisning
                slettAction={() => {
                    doSlettMal();
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
    history: AppPT.history.isRequired,
};

const mapStateToProps = state => ({
    malData: selectMalListe(state),
});

const mapDispatchToProps = (dispatch, props) => ({
    doSlettMal: () =>
        dispatch(slettMal()).then(() => props.history.push('/mal')),
});

export default AktivitetsmalModal(
    connect(mapStateToProps, mapDispatchToProps)(AktivitetmalSlett)
);
