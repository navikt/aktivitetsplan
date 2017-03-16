import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import StillingAktivitetForm from './stilling-aktivitet-form';
import AktivitetHeader from '../aktivitet-header';
import { lagNyAktivitet } from '../../ducks/aktiviteter';
import history from './../../history';
import { STILLING_AKTIVITET_TYPE } from '../../constant';
import ModalScrollVindu from './../modal-scroll-vindu';
import ModalFooter from './../modal-footer';
import RemoteSubmitKnapp from './remote-submit-knapp';


function StillingAktivitet({ onLagreNyAktivitet }) {
    const onLagNyAktivitetSubmit = (aktivitet) => {
        const nyAktivitet = { ...aktivitet, type: STILLING_AKTIVITET_TYPE };
        onLagreNyAktivitet(nyAktivitet);
        history.push('/');
    };

    return (
        <section className="stilling-aktivitet" aria-labelledby="modal-stillings-aktivitet-header">
            <AktivitetHeader aktivitetType="Ledig stilling" />
            <ModalScrollVindu>
                <StillingAktivitetForm onSubmit={onLagNyAktivitetSubmit} />
            </ModalScrollVindu>
            <ModalFooter>
                <RemoteSubmitKnapp formNavn="stilling-aktivitet" className="modal-footer__knapp" />
            </ModalFooter>
        </section>
    );
}

StillingAktivitet.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    onLagreNyAktivitet: (aktivitet) => lagNyAktivitet(aktivitet)(dispatch)
});

export default connect(null, mapDispatchToProps)(StillingAktivitet);
