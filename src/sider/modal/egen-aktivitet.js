import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import EgenAktivitetForm from './egen-aktivitet-form';
import history from './../../history';
// import KommentarForAktivitet from '../../felles-komponenter/kommentar-for-aktivitet';
import AktivitetHeader from '../../felles-komponenter/aktivitet-header';
import { lagNyAktivitet } from '../../ducks/aktiviteter';
import { EGEN_AKTIVITET_TYPE } from '../../constant';

function EgenAktivitet({ onLagreNyAktivitet }) {
    const onLagNyAktivitetSubmit = (aktivitet) => {
        const nyAktivitet = { ...aktivitet, type: EGEN_AKTIVITET_TYPE };
        onLagreNyAktivitet(nyAktivitet);
        history.push('/');
    };

    return (
        <article className="egen-aktivitet" aria-labelledby="modal-egen-aktivitet-header">
            <AktivitetHeader aktivitetType="Egen aktivitet" />
            <EgenAktivitetForm onSubmit={onLagNyAktivitetSubmit} />
            {/* <KommentarForAktivitet />*/}
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

