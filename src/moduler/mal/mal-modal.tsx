import React from 'react';
import { useSelector } from 'react-redux';

import Modal from '../../felles-komponenter/modal/Modal';
import { selectHentMalListeFeil } from '../feilmelding/feil-selector';

interface Props {
    children: React.ReactNode;
    onRequestClosed: () => void;
    heading: string;
}

export function MalModal(props: Props) {
    const { children, heading } = props;
    const feil = useSelector(selectHentMalListeFeil);

    return (
        <Modal onRequestClose={props.onRequestClosed} feilmeldinger={feil} heading={heading}>
            {children}
        </Modal>
    );
}
