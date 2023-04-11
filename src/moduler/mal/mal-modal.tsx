import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import Modal from '../../felles-komponenter/modal/Modal';
import { selectMalListeFeilmeldinger } from './malliste-selector';

interface Props {
    children: React.ReactNode;
    onRequestClosed: () => void;
}

export function MalModal(props: Props) {
    const { children } = props;
    const feil = useSelector(selectMalListeFeilmeldinger, shallowEqual);

    return (
        <Modal
            onRequestClose={props.onRequestClosed}
            contentLabel="aktivitetsmal-modal"
            feilmeldinger={feil}
            header={null}
        >
            {children}
        </Modal>
    );
}
