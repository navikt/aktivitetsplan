import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel } from 'nav-frontend-typografi';
import * as AppPT from '../../proptypes';
import Modal from '../../felles-komponenter/modal/modal';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import {
    selectMotpartSlice,
    selectNavnPaMotpart,
} from '../motpart/motpart-selector';
import FnrProvider from './../../bootstrap/fnr-provider';

function InnstillingerModal({
    avhengigheter,
    children,
    navnPaMotpart,
    onRequestClose,
    ingenTilbakeKnapp,
}) {
    return (
        <FnrProvider>
            <Modal
                header={
                    <ModalHeader
                        tilbakeTekstId={
                            ingenTilbakeKnapp
                                ? null
                                : 'innstillinger.modal.tilbake'
                        }
                    />
                }
                contentLabel="instillinger-modal"
                contentClass="innstillinger"
                onRequestClose={onRequestClose}
            >
                <article className="innstillinger__container">
                    <Innholdslaster
                        avhengigheter={avhengigheter}
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
        </FnrProvider>
    );
}

InnstillingerModal.defaultProps = {
    children: undefined,
    navnPaMotpart: undefined,
    onRequestClose: undefined,
    ingenTilbakeKnapp: undefined,
};

InnstillingerModal.propTypes = {
    navnPaMotpart: PT.string,
    avhengigheter: AppPT.avhengigheter.isRequired,
    children: PT.node,
    onRequestClose: PT.func,
    ingenTilbakeKnapp: PT.bool,
};

const mapStateToProps = state => ({
    avhengigheter: [selectMotpartSlice(state)],
    navnPaMotpart: selectNavnPaMotpart(state),
});

export default connect(mapStateToProps)(InnstillingerModal);
