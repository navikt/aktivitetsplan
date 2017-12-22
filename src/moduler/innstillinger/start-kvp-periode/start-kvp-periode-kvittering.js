import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import history from '../../../history';
import * as AppPT from '../../../proptypes';
import Modal from '../../../felles-komponenter/modal/modal';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
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
import { selectErUnderKvpOppfolging } from '../../oppfolging-status/oppfolging-selector';

function StartKvpKvittering({
    avhengigheter,
    begrunnelse,
    erUnderKvpOppfolging,
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
                    <br />
                    <div className="innstillinger__innhold blokk-xs">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.start-kvp.tittel" />
                        </Systemtittel>
                    </div>
                    <HiddenIfAlertStripeSuksess
                        hidden={!erUnderKvpOppfolging}
                        className="blokk-m"
                    >
                        <FormattedMessage
                            id="innstillinger.modal.start-kvp.kvittering.ok"
                            values={{ begrunnelse }}
                        >
                            {text =>
                                <span className="whitespace">
                                    {text}
                                </span>}
                        </FormattedMessage>
                    </HiddenIfAlertStripeSuksess>
                    <HiddenIfAlertStripeAdvarsel
                        hidden={erUnderKvpOppfolging}
                        className="blokk-m"
                    >
                        <FormattedMessage id="innstillinger.modal.start-kvp.kvittering.feilet" />
                    </HiddenIfAlertStripeAdvarsel>
                </article>
            </Innholdslaster>
        </Modal>
    );
}

StartKvpKvittering.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    navn: PT.string.isRequired,
    erUnderKvpOppfolging: PT.bool.isRequired,
    begrunnelse: PT.string.isRequired,
};

const mapStateToProps = state => ({
    avhengigheter: [selectInnstillingerSlice(state), selectMotpartSlice(state)],
    navn: selectNavnPaMotpart(state),
    erUnderKvpOppfolging: selectErUnderKvpOppfolging(state),
    begrunnelse: selectInnstillingerBegrunnelse(state),
});

export default connect(mapStateToProps)(StartKvpKvittering);
