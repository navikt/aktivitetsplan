import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import PT from 'prop-types';
import Modal from '../../felles-komponenter/modal/modal';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import { selectMalListeFeilmeldinger } from './aktivitetsmal-selector';

export function MalModal({ children }) {
    const feil = useSelector(selectMalListeFeilmeldinger, shallowEqual);

    return (
        <Modal contentLabel="aktivitetsmal-modal" feilmeldinger={feil}>
            <ModalContainer>{children}</ModalContainer>
        </Modal>
    );
}

MalModal.propTypes = {
    children: PT.node.isRequired
};
