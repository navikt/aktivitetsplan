import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { isDirty } from 'redux-form';
import EgenAktivitetForm, { formNavn } from './egen-aktivitet-form';
import history from './../../history';
import ModalHeader from '../modal-header';
import { lagNyAktivitet } from '../../ducks/aktiviteter';
import { EGEN_AKTIVITET_TYPE } from '../../constant';
import ModalContainer from '../modal-container';
import { LUKK_MODAL } from '../../ducks/modal';
import { aktivitetRoute } from '../../routing';
import Modal from '../modal';

function EgenAktivitet({ onLagreNyAktivitet, formIsDirty, lukkModal, intl }) {
    const onLagNyAktivitetSubmit = aktivitet => {
        const nyAktivitet = {
            ...aktivitet,
            type: EGEN_AKTIVITET_TYPE,
        };

        onLagreNyAktivitet(nyAktivitet).then(action =>
            history.push(aktivitetRoute(action.data.id))
        );
    };

    return (
        <Modal
            isOpen
            key="egenAktivitetModal"
            onRequestClose={() => {
                const dialogTekst = intl.formatMessage({
                    id: 'aktkivitet-skjema.lukk-advarsel',
                });

                // eslint-disable-next-line no-alert
                if (!formIsDirty || confirm(dialogTekst)) {
                    history.push('/');
                    lukkModal();
                }
            }}
            contentLabel="aktivitet-modal"
        >
            <article
                className="egen-aktivitet"
                aria-labelledby="modal-egen-aktivitet-header"
            >
                <ModalHeader
                    visConfirmDialog={formIsDirty}
                    tilbakeTekstId="ny-aktivitet-modal.tilbake"
                />
                <ModalContainer>
                    <EgenAktivitetForm onSubmit={onLagNyAktivitetSubmit} />
                </ModalContainer>
            </article>
        </Modal>
    );
}

EgenAktivitet.propTypes = {
    onLagreNyAktivitet: PT.func.isRequired,
    formIsDirty: PT.bool.isRequired,
    intl: intlShape.isRequired,
    lukkModal: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    onLagreNyAktivitet: aktivitet => dispatch(lagNyAktivitet(aktivitet)),
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
});

const mapStateToProps = state => ({
    formIsDirty: isDirty(formNavn)(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(EgenAktivitet)
);
