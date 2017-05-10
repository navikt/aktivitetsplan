import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Modal from './modal';
import { LUKK_MODAL } from '../ducks/modal';
import history from './../history';

function StandardModal({ lukkModal, name, children }) {
    return (
        <Modal
            isOpen
            key={name}
            onRequestClose={
                () => {
                    history.push('/');
                    lukkModal();
                }
            }
            contentLabel="aktivitet-modal"
        >
            { children }
        </Modal>
    );
}

StandardModal.propTypes = {
    lukkModal: PT.func.isRequired,
    name: PT.string.isRequired,
    children: PT.node.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    lukkModal: () => dispatch({ type: LUKK_MODAL })
});

export default connect(null, mapDispatchToProps)(StandardModal);
