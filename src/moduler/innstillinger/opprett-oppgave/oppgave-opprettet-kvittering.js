import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import PT from 'prop-types';
import Modal from '../../../felles-komponenter/modal/modal';
import history from '../../../history';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../../proptypes';
import {
    HiddenIfAlertStripeAdvarsel,
    HiddenIfAlertStripeSuksess,
} from '../../../felles-komponenter/hidden-if/hidden-if-alertstriper';
import { selectNavnPaMotpart } from '../../motpart/motpart-selector';
import { selectOpprettOppgave } from './opprett-oppgave-reducer';

function OppgaveOpprettetKvittering({ avhengigheter, navn, opprettOppgave }) {
    return (
        <Modal
            onRequestClose={() => history.push('/')}
            contentLabel="instillinger-modal"
            contentClass="innstillinger"
        >
            <Innholdslaster avhengigheter={avhengigheter}>
                <article className="innstillinger__container">
                    <Innholdstittel>
                        <FormattedMessage
                            id="innstillinger.modal.overskrift"
                            values={{ navn }}
                        />
                    </Innholdstittel>
                    <div className="innstillinger__innhold blokk-xs">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.opprett-oppgave.beskrivelse" />
                        </Systemtittel>
                    </div>
                    <HiddenIfAlertStripeSuksess
                        hidden={!opprettOppgave}
                        className="blokk-m"
                    >
                        <FormattedMessage
                            id="innstillinger.modal.opprett-oppgave.kvittering.ok"
                            values={{ ...opprettOppgave }}
                        >
                            {text =>
                                <span className="whitespace">
                                    {text}
                                </span>}
                        </FormattedMessage>
                    </HiddenIfAlertStripeSuksess>
                    <HiddenIfAlertStripeAdvarsel
                        hidden={!!opprettOppgave}
                        className="blokk-m"
                    >
                        <FormattedMessage id="innstillinger.modal.opprett-oppgave.kvittering.feilet" />
                    </HiddenIfAlertStripeAdvarsel>
                </article>
            </Innholdslaster>
        </Modal>
    );
}

OppgaveOpprettetKvittering.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    navn: PT.string.isRequired,
    opprettOppgave: PT.object.isRequired,
};

const mapStateToProps = state => ({
    avhengigheter: [selectOpprettOppgave(state)],
    navn: selectNavnPaMotpart(state),
    opprettOppgave: selectOpprettOppgave(state).data,
});

export default connect(mapStateToProps)(OppgaveOpprettetKvittering);
