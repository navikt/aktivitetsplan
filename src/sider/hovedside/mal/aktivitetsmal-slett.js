import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import BekreftSlettVisning from '../../../moduler/aktivitet/visning/bekreft-slett-visning/bekreft-slett-visning';
import history from '../../../history';
import { slettMal } from '../../../moduler/mal/mal-reducer';
import AktivitetsmalModal from './aktivitetsmal-modal';

// denne brukes i routing og må da være component
// eslint-disable-next-line react/prefer-stateless-function
class AktivitetmalSlett extends Component {
    render() {
        const { doSlettMal } = this.props;
        return (
            <BekreftSlettVisning
                slettAction={() => {
                    doSlettMal();
                    history.push('/mal');
                }}
                avbrytAction={() => history.push('/mal')}
                tittel="aktivitetsmal.bekreft-sletting.tittel"
            />
        );
    }
}

AktivitetmalSlett.propTypes = {
    doSlettMal: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    doSlettMal: () => dispatch(slettMal()),
});

export default AktivitetsmalModal(
    connect(null, mapDispatchToProps)(AktivitetmalSlett)
);
