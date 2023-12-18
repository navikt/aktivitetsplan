import React from 'react';
import { useSelector } from 'react-redux';

import Modal from '../../felles-komponenter/modal/Modal';
import { selectHentMalListeFeil } from '../feilmelding/feil-selector';
import { useNavigate } from 'react-router-dom';
import { useRoutes } from '../../routes';

interface Props {
    children: React.ReactNode;
    onRequestClosed: () => boolean;
    heading: string;
}

export function MalModal(props: Props) {
    const { children, heading } = props;
    const feil = useSelector(selectHentMalListeFeil);
    const navigate = useNavigate();
    const { hovedsideRoute } = useRoutes();
    const tilHovedside = () => navigate(hovedsideRoute());

    return (
        <Modal onClose={tilHovedside} onRequestClose={props.onRequestClosed} feilmeldinger={feil} heading={heading}>
            {children}
        </Modal>
    );
}
