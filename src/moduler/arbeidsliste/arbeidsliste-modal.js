import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Modal from '../../felles-komponenter/modal/modal';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
import ModalFooter from '../../felles-komponenter/modal/modal-footer';
import history from '../../history';

const lukkModal = () => history.push('/');
function ArbeidslisteModal({ children, handleSubmit }) {
    return (
        <Modal
            isOpen
            onRequestClose={() => {
                history.push('/');
            }}
            contentLabel="arbeidsliste-modal"
            contentClass="arbeidsliste"
        >
            <ModalHeader />
            {children}
            <ModalFooter>
                <div>
                    <button
                        type="submit"
                        className="knapp knapp--hoved"
                        onClick={handleSubmit}
                    >
                        <FormattedMessage id="modal.knapp.lagre" />
                    </button>
                    <button type="button" className="knapp" onClick={lukkModal}>
                        <FormattedMessage id="modal.knapp.avbryt" />
                    </button>
                </div>
            </ModalFooter>
        </Modal>
    );
}

ArbeidslisteModal.propTypes = {
    children: PT.node.isRequired,
    handleSubmit: PT.func.isRequired,
};

export default ArbeidslisteModal;
