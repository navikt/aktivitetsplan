import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import Modal from '../modal';
import ModalHeader from '../modal-header';
import history from '../../history';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../proptypes';

function SettManuellKvittering({ motpart, begrunnelse }) {
    const { navn } = motpart.data;
    return (
        <Modal
            isOpen
            onRequestClose={() => history.push('/')}
            contentLabel="instillinger-modal"
            contentClass="innstillinger"
        >
            <ModalHeader />
            <Innholdslaster avhengigheter={[motpart]}>
                <article className="innstillinger__container">
                    <Innholdstittel>
                        <FormattedMessage
                            id="innstillinger.modal.overskrift"
                            values={{ navn }}
                        />
                    </Innholdstittel>
                    <div className="innstillinger__innhold blokk-xs">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.manuell.overskrift" />
                        </Systemtittel>
                    </div>
                    <AlertStripeSuksess className="blokk-m">
                        <FormattedMessage
                            // TODO: lage denne
                            id="innstillinger.modal.manuell.kvittering"
                            values={{ begrunnelse }}
                        />
                    </AlertStripeSuksess>
                </article>
            </Innholdslaster>
        </Modal>
    );
}

SettManuellKvittering.defaultProps = {
    motpart: undefined,
};

SettManuellKvittering.propTypes = {
    motpart: AppPT.motpart,
    begrunnelse: PT.string.isRequired,
};

const mapStateToProps = state => ({
    motpart: state.data.motpart,
});

export default connect(mapStateToProps)(SettManuellKvittering);
