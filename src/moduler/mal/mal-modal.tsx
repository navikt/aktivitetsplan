import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import Modal from '../../felles-komponenter/modal/Modal';
import ModalContainer from '../../felles-komponenter/modal/ModalContainer';
import { selectMalListeFeilmeldinger } from './aktivitetsmal-selector';

interface Props {
    children: React.ReactNode;
}

export function MalModal(props: Props) {
    const { children } = props;
    const feil = useSelector(selectMalListeFeilmeldinger, shallowEqual);

    return (
        <Modal contentLabel="aktivitetsmal-modal" feilmeldinger={feil}>
            <ModalContainer>{children}</ModalContainer>
        </Modal>
    );
}
