import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import Modal from '../../felles-komponenter/modal/modal';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
import ModalContainer from '../../felles-komponenter/modal/modal-container';

function AktivitetsmalModal(Component) {
    return function inner(props) {
        return (
            <div>
                <Modal
                    header={<ModalHeader className="aktivitetmal__modal" />}
                    contentLabel="aktivitetsmal-modal"
                >
                    <ModalContainer>
                        <Innholdstittel className="aktivitetmal__header">
                            <FormattedMessage id="aktivitetsmal.mitt-mal.header" />
                        </Innholdstittel>
                        <Component {...props} />
                    </ModalContainer>
                </Modal>
            </div>
        );
    };
}

export default AktivitetsmalModal;
