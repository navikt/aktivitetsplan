import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import Modal from '../modal';
import ModalHeader from '../modal-header';
import history from '../../history';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';

function InnstillingerModal({ motpart, children }) {
    const { navn } = motpart.data;
    return (
        <Modal
            isOpen
            onRequestClose={() => {
                history.push('/');
            }}
            contentLabel="instillinger-modal"
            contentClass="innstillinger"
        >
            <ModalHeader tilbakeTekstId="innstillinger.modal.tilbake" />
            <article className="innstillinger__container">
                <Innholdslaster avhengigheter={[motpart]}>
                    <Innholdstittel>
                        <FormattedMessage
                            id="innstillinger.modal.overskrift"
                            values={{ navn }}
                        />
                    </Innholdstittel>
                </Innholdslaster>
            </article>
            <VisibleIfDiv
                visible={!!children}
                className="innstillinger__innhold"
            >
                {children}
            </VisibleIfDiv>
        </Modal>
    );
}

InnstillingerModal.defaultProps = {
    children: undefined,
    motpart: undefined,
};

InnstillingerModal.propTypes = {
    motpart: PT.shape({
        status: PT.string,
        data: PT.shape({
            navn: PT.string,
        }),
    }),
    children: PT.node,
};

const mapStateToProps = state => ({
    motpart: state.data.motpart,
});

export default connect(mapStateToProps)(InnstillingerModal);
