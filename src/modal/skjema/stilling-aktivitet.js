import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { isDirty } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';
import StillingAktivitetForm, { formNavn } from './stilling-aktivitet-form';
import { lagNyAktivitet } from '../../ducks/aktiviteter';
import history from './../../history';
import { STILLING_AKTIVITET_TYPE } from '../../constant';
import ModalHeader from '../modal-header';
import ModalContainer from '../modal-container';
import Modal from '../modal';
import { LUKK_MODAL } from '../../ducks/modal';
import { aktivitetRoute } from '../../routing';

function StillingAktivitet({ onLagreNyAktivitet, formIsDirty, lukkModal, intl }) {
    const onLagNyAktivitetSubmit = (aktivitet) => {
        const nyAktivitet = { ...aktivitet, type: STILLING_AKTIVITET_TYPE };
        onLagreNyAktivitet(nyAktivitet)
            .then((action) => history.push(aktivitetRoute(action.data.id)));
    };

    return (
        <Modal
            isOpen
            key="stillingAktivitetModal"
            onRequestClose={
                () => {
                    const dialogTekst = intl.formatMessage({ id: 'aktkivitet-skjema.lukk-advarsel' });
                    if (!formIsDirty || confirm(dialogTekst)) { // eslint-disable-line no-alert
                        history.push('/');
                        lukkModal();
                    }
                }
            }
            contentLabel="aktivitet-modal"
        >
            <section className="stilling-aktivitet" aria-labelledby="modal-stillings-aktivitet-header">
                <ModalHeader visConfirmDialog={formIsDirty} tilbakeTekstId="ny-aktivitet-modal.tilbake" />
                <ModalContainer>
                    <StillingAktivitetForm onSubmit={onLagNyAktivitetSubmit} />
                </ModalContainer>
            </section>
        </Modal>
    );
}

StillingAktivitet.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    formIsDirty: PT.bool.isRequired,
    intl: intlShape.isRequired,
    lukkModal: PT.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    onLagreNyAktivitet: (aktivitet) => lagNyAktivitet(aktivitet)(dispatch),
    lukkModal: () => dispatch({ type: LUKK_MODAL })
});

const mapStateToProps = (state) => ({
    formIsDirty: isDirty(formNavn)(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(StillingAktivitet));
