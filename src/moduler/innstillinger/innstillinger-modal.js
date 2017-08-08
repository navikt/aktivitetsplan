import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import * as AppPT from '../../proptypes';
import Modal from '../../felles-komponenter/modal/modal';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
import history from '../../history';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';

function InnstillingerModal({ motpart, children, navnPaMotpart }) {

    return (
        <Modal
            isOpen
            onRequestClose={() => history.push( '/')}
            contentLabel="instillinger-modal"
            contentClass="innstillinger"
        >
            <ModalHeader tilbakeTekstId="innstillinger.modal.tilbake" />
            <article className="innstillinger__container">
                <Innholdslaster
                    avhengigheter={[motpart]}
                    className="innstillinger__spinner"
                >
                    <Innholdstittel className="innstillinger__overskrift">
                        <FormattedMessage
                            id="innstillinger.modal.overskrift"
                            values={{ navn: navnPaMotpart }}
                        />
                    </Innholdstittel>
                </Innholdslaster>
                <VisibleIfDiv
                    visible={!!children}
                    className="innstillinger__innhold"
                >
                    {children}
                </VisibleIfDiv>
            </article>
        </Modal>
    );
}

InnstillingerModal.defaultProps = {
    children: undefined,
    navnPaMotpart: undefined,
};

InnstillingerModal.propTypes = {
    navnPaMotpart: PT.string,
    motpart: AppPT.reducer.isRequired,
    children: PT.node,
};

const mapStateToProps = state => {
    const motpart = state.data.motpart;
    return {
        motpart,
        navnPaMotpart: motpart.data.navn,
    };
};

export default connect(mapStateToProps)(InnstillingerModal);
