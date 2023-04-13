import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import Modal from '../../felles-komponenter/modal/Modal';
import { selectMalListeFeilmeldinger } from './aktivitetsmal-selector';

interface Props {
    children: React.ReactNode;
    onRequestClosed: () => void;
}

export function MalModal(props: Props) {
    const { children } = props;
    const feil = useSelector(selectMalListeFeilmeldinger, shallowEqual);

    return (
        <Modal onRequestClose={props.onRequestClosed} feilmeldinger={feil} header={null}>
            {children}
        </Modal>
    );
}
