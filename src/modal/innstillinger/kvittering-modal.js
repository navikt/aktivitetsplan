import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import {
    AlertStripeSuksess,
    AlertStripeAdvarsel,
} from 'nav-frontend-alertstriper';
import Modal from '../modal';
import ModalHeader from '../modal-header';
import history from '../../history';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../proptypes';

function KvitteringModal({
    motpart,
    alertTekstId,
    overskriftTekstId,
    alertFeilTekst,
    situasjon,
}) {
    const { navn } = motpart.data;
    return (
        <Modal
            isOpen
            onRequestClose={() => history.push('/')}
            contentLabel="instillinger-modal"
            contentClass="innstillinger"
        >
            <ModalHeader />
            <article className="innstillinger__container">
                <Innholdslaster avhengigheter={[motpart]}>
                    <Innholdstittel>
                        <FormattedMessage
                            id="innstillinger.modal.overskrift"
                            values={{ navn }}
                        />
                    </Innholdstittel>
                </Innholdslaster>
                <div className="innstillinger__innhold blokk-xs">
                    <Systemtittel>
                        <FormattedMessage id={overskriftTekstId} />
                    </Systemtittel>
                </div>
                {situasjon.data.avslutningStatus &&
                    situasjon.data.avslutningStatus.kanAvslutte
                    ? <AlertStripeSuksess className="blokk-m">
                          <FormattedMessage
                              id={alertTekstId}
                              values={{ navn }}
                          />
                      </AlertStripeSuksess>
                    : <AlertStripeAdvarsel className="blokk-m">
                          <FormattedMessage id={alertFeilTekst} />
                      </AlertStripeAdvarsel>}
            </article>
        </Modal>
    );
}

KvitteringModal.defaultProps = {
    motpart: undefined,
    alertFeilTekst: '',
    situasjon: undefined,
};

KvitteringModal.propTypes = {
    motpart: PT.shape({
        status: PT.string,
        data: PT.shape({
            navn: PT.string,
        }),
    }),
    alertTekstId: PT.string.isRequired,
    overskriftTekstId: PT.string.isRequired,
    alertFeilTekst: PT.string,
    situasjon: AppPT.situasjon,
};

const mapStateToProps = state => ({
    motpart: state.data.motpart,
    situasjon: state.data.situasjon,
});

export default connect(mapStateToProps)(KvitteringModal);
