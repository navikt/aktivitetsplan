import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import {
    AlertStripeSuksess,
    AlertStripeAdvarsel,
} from 'nav-frontend-alertstriper';
import Modal from '../../../modal/modal';
import ModalHeader from '../../../modal/modal-header';
import history from '../../../history';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../../proptypes';

function AvsluttOppfolgingKvittering({ motpart, situasjon }) {
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
                            <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.overskrift" />
                        </Systemtittel>
                    </div>
                    {situasjon.data.avslutningStatus &&
                        !situasjon.data.avslutningStatus.kanAvslutte
                        ? <AlertStripeSuksess className="blokk-m">
                              <FormattedMessage
                                  id="innstillinger.modal.avslutt.oppfolging.kvittering"
                                  values={{ navn }}
                              />
                          </AlertStripeSuksess>
                        : <AlertStripeAdvarsel className="blokk-m">
                              <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.kvittering.feil" />
                          </AlertStripeAdvarsel>}
                </article>
            </Innholdslaster>
        </Modal>
    );
}

AvsluttOppfolgingKvittering.defaultProps = {
    motpart: undefined,
    situasjon: undefined,
};

AvsluttOppfolgingKvittering.propTypes = {
    motpart: AppPT.motpart,
    situasjon: AppPT.situasjon,
};

const mapStateToProps = state => ({
    motpart: state.data.motpart,
    situasjon: state.data.situasjon,
});

export default connect(mapStateToProps)(AvsluttOppfolgingKvittering);
