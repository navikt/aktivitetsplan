import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import Modal from '../../modal/modal';
import ModalHeader from '../../modal/modal-header';
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
                <Innholdslaster
                    avhengigheter={[motpart]}
                    className="innstillinger__spinner"
                >
                    <div>
                        <Innholdstittel className="innstillinger__overskrift">
                            <FormattedMessage
                                id="innstillinger.modal.overskrift"
                                values={{ navn }}
                            />
                        </Innholdstittel>
                        <VisibleIfDiv
                            visible={!!children}
                            className="innstillinger__innhold"
                        >
                            {children}
                        </VisibleIfDiv>
                    </div>
                </Innholdslaster>
            </article>
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
