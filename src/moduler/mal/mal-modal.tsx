import React from 'react';
import { useSelector } from 'react-redux';

import Modal from '../../felles-komponenter/modal/Modal';
import { selectHentMalListeFeil } from '../feilmelding/feil-selector';

interface Props {
    children: React.ReactNode;
    onRequestClosed: () => void;
}

export function MalModal(props: Props) {
    const { children } = props;
    const feil = useSelector(selectHentMalListeFeil);

    return (
        <Modal onRequestClose={props.onRequestClosed} feilmeldinger={feil} header={null} contentLabel={'Mitt mål'}>
            {children}
        </Modal>
    );
}
