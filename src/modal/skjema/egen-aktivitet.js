import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import EgenAktivitetForm from './egen-aktivitet-form';
import history from './../../history';
import ModalHeader from '../modal-header';
import { lagNyAktivitet } from '../../ducks/aktiviteter';
import { EGEN_AKTIVITET_TYPE } from '../../constant';
import ModalScrollVindu from '../modal-scroll-vindu';
import ModalFooter from '../modal-footer';
import RemoteSubmitKnapp from './remote-submit-knapp';

function EgenAktivitet({ onLagreNyAktivitet }) {
    const onLagNyAktivitetSubmit = (aktivitet) => {
        const nyAktivitet = { ...aktivitet, type: EGEN_AKTIVITET_TYPE };
        onLagreNyAktivitet(nyAktivitet);
        history.push('/');
    };

    return (
        <article className="egen-aktivitet" aria-labelledby="modal-egen-aktivitet-header">
            <ModalHeader tilbakeTekstId="ny-aktivitet-modal.tilbake" />
            <ModalScrollVindu>
                <EgenAktivitetForm onSubmit={onLagNyAktivitetSubmit} />
            </ModalScrollVindu>
            <ModalFooter>
                <RemoteSubmitKnapp formNavn="egen-aktivitet" className="modal-footer__knapp" />
            </ModalFooter>
        </article>
    );
}


EgenAktivitet.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    onLagreNyAktivitet: (aktivitet) => lagNyAktivitet(aktivitet)(dispatch)
});

export default connect(null, mapDispatchToProps)(EgenAktivitet);

