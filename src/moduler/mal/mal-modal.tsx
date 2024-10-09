import React from 'react';
import { useSelector } from 'react-redux';

import Modal from '../../felles-komponenter/modal/Modal';
import { selectHentMalListeFeil } from '../feilmelding/feil-selector';
// import { useNavigate } from 'react-router-dom';
// import { useRoutes } from '../../routing/useRoutes';

interface Props {
    children: React.ReactNode;
    onRequestClosed: () => boolean;
    heading: string;
}

export function MalModal(props: Props) {
    const { children, heading } = props;
    const feil = useSelector(selectHentMalListeFeil);

    return (
        <Modal lukkPåKlikkUtenfor={true} onRequestClose={props.onRequestClosed} feilmeldinger={feil} heading={heading}>
            {children}
        </Modal>
    );
}
