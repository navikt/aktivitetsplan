import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import Modal from '../../../felles-komponenter/modal/modal';
import history from '../../../history';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../../proptypes';
import {
    HiddenIfAlertStripeAdvarsel,
    HiddenIfAlertStripeSuksess,
} from '../../../felles-komponenter/hidden-if/hidden-if-alertstriper';
import {
    selectMotpartSlice,
    selectNavnPaMotpart,
} from '../../motpart/motpart-selector';
import {
    selectInnstillingerBegrunnelse,
    selectInnstillingerSlice,
} from '../innstillinger-selector';
import { selectErUnderKvp } from '../../oppfolging-status/oppfolging-selector';

function StoppKvpKvittering({ avhengigheter, begrunnelse, erUnderKvp, navn }) {
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
                    <br />
                    <div className="innstillinger__innhold blokk-xs">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.stopp-kvp.tittel" />
                        </Systemtittel>
                    </div>
                    <HiddenIfAlertStripeSuksess
                        hidden={erUnderKvp}
                        className="blokk-m"
                    >
                        <FormattedMessage
                            id="innstillinger.modal.stopp-kvp.kvittering.ok"
                            values={{ begrunnelse }}
                        >
                            {text =>
                                <span className="whitespace">
                                    {text}
                                </span>}
                        </FormattedMessage>
                    </HiddenIfAlertStripeSuksess>
                    <HiddenIfAlertStripeAdvarsel
                        hidden={!erUnderKvp}
                        className="blokk-m"
                    >
                        <FormattedMessage id="innstillinger.modal.stopp-kvp.kvittering.feilet" />
                    </HiddenIfAlertStripeAdvarsel>
                </article>
            </Innholdslaster>
        </Modal>
    );
}

StoppKvpKvittering.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    navn: PT.string.isRequired,
    erUnderKvp: PT.bool.isRequired,
    begrunnelse: PT.string.isRequired,
};

const mapStateToProps = state => ({
    avhengigheter: [selectInnstillingerSlice(state), selectMotpartSlice(state)],
    navn: selectNavnPaMotpart(state),
    erUnderKvp: selectErUnderKvp(state),
    begrunnelse: selectInnstillingerBegrunnelse(state),
});

export default connect(mapStateToProps)(StoppKvpKvittering);
