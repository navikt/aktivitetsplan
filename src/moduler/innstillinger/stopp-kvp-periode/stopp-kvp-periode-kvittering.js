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
import {
    selectMotpartSlice,
    selectNavnPaMotpart,
} from '../../motpart/motpart-selector';
import {
    selectErManuell,
    selectInnstillingerBegrunnelse,
    selectInnstillingerSlice,
} from '../innstillinger-selector';

function StoppKvpKvittering({
                                             avhengigheter,
                                             begrunnelse,
                                             manuell,
                                             navn,
                                         }) {
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
                            <FormattedMessage id="innstillinger.modal.manuell.overskrift" />
                        </Systemtittel>
                    </div>
                    <HiddenIfAlertStripeSuksess
                        hidden={!manuell}
                        className="blokk-m"
                    >
                        <FormattedMessage
                            id="innstillinger.modal.manuell.kvittering.ok"
                            values={{ begrunnelse }}
                        >
                            {text =>
                                <span className="whitespace">
                                    {text}
                                </span>}
                        </FormattedMessage>
                    </HiddenIfAlertStripeSuksess>
                    <HiddenIfAlertStripeAdvarsel
                        hidden={manuell}
                        className="blokk-m"
                    >
                        <FormattedMessage id="innstillinger.modal.manuell.kvittering.feilet" />
                    </HiddenIfAlertStripeAdvarsel>
                </article>
            </Innholdslaster>
        </Modal>
    );
}

StoppKVPKvittering.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    navn: PT.string.isRequired,
    manuell: PT.bool.isRequired,
    begrunnelse: PT.string.isRequired,
};

const mapStateToProps = state => ({
    avhengigheter: [selectInnstillingerSlice(state), selectMotpartSlice(state)],
    navn: selectNavnPaMotpart(state),
    manuell: selectErManuell(state),
    begrunnelse: selectInnstillingerBegrunnelse(state),
});

export default connect(mapStateToProps)(StoppKvpKvittering);
