import React from 'react';
import { FormattedMessage } from 'react-intl';
import AktivitetsMal from './aktivitetsmal';
import Modal from '../../../modal/modal';
import ModalHeader from '../../../modal/modal-header';
import ModalContainer from '../../../modal/modal-container';
import history from '../../../history';
import Hovedside from '../hovedside';


function AktivitetsmalModal() {
    return (
        <div>
            <Hovedside />
            <Modal className="" isOpen onRequestClose={() => history.push('/')}>
                <ModalHeader
                    normalTekstId={<FormattedMessage id="aktivitetsmal.mitt-mal" />}
                    className="side-innhold"
                    aria-labelledby=""
                >
                    <ModalContainer>
                        <AktivitetsMal />
                    </ModalContainer>
                </ModalHeader >
            </Modal>
        </div>
    );
}

export default AktivitetsmalModal;
