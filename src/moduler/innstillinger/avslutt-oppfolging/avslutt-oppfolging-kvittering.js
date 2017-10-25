import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import PT from 'prop-types';
import Modal from '../../../felles-komponenter/modal/modal';
import history from '../../../history';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../../proptypes';
import { HiddenIfAlertStripeSuksess } from '../../../felles-komponenter/hidden-if/hidden-if-alertstriper';
import {
    selectMotpartStatus,
    selectNavnPaMotpart,
} from '../../motpart/motpart-selector';
import {
    selectAvslutningStatus,
    selectUnderOppfolging,
} from '../../oppfolging-status/oppfolging-selector';

function AvsluttOppfolgingKvittering({ avhengigheter, navn, avsluttet }) {
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
                            <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.overskrift" />
                        </Systemtittel>
                    </div>
                    <HiddenIfAlertStripeSuksess
                        hidden={!avsluttet}
                        className="blokk-m"
                    >
                        <FormattedMessage
                            id="innstillinger.modal.avslutt.oppfolging.kvittering"
                            values={{ navn }}
                        />
                    </HiddenIfAlertStripeSuksess>
                </article>
            </Innholdslaster>
        </Modal>
    );
}

AvsluttOppfolgingKvittering.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    avsluttet: PT.bool.isRequired,
    navn: PT.string.isRequired,
};

const mapStateToProps = state => ({
    avhengigheter: [selectMotpartStatus(state)],
    navn: selectNavnPaMotpart(state),
    avsluttet: selectAvslutningStatus(state) && !selectUnderOppfolging(state),
});

export default connect(mapStateToProps)(AvsluttOppfolgingKvittering);
