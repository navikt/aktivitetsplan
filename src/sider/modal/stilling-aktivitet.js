import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
// import KommentarForAktivitet from '../../felles-komponenter/kommentar-for-aktivitet';
import StillingAktivitetForm from './stilling-aktivitet-form';
import AktivitetHeader from '../../felles-komponenter/aktivitet-header';
import { lagNyAktivitet } from '../../ducks/aktiviteter';
import history from './../../history';
import { STILLING_AKTIVITET_TYPE } from '../../constant';


function StillingAktivitet({ onLagreNyAktivitet }) {
    const onLagNyAktivitetSubmit = (aktivitet) => {
        const nyAktivitet = { ...aktivitet, type: STILLING_AKTIVITET_TYPE };
        onLagreNyAktivitet(nyAktivitet);
        history.push('/');
    };

    return (
        <section className="stilling-aktivitet" aria-labelledby="modal-stillings-aktivitet-header">
            <AktivitetHeader aktivitetType="Ledig stilling" />
            <StillingAktivitetForm onSubmit={onLagNyAktivitetSubmit} />
            {/* <KommentarForAktivitet />*/}
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
