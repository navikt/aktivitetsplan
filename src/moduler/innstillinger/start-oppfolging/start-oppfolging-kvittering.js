import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import PT from 'prop-types';
import Modal from '../../../felles-komponenter/modal/modal';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../../proptypes';
import { selectNavnPaMotpart } from '../../motpart/motpart-selector';
import { selectOppfolgingStatus } from '../../oppfolging-status/oppfolging-selector';
import { selectIdentitetStatus } from '../../identitet/identitet-selector';

function StartOppfolgingKvittering({ avhengigheter, navn, history }) {
    return (
        <Modal
            onRequestClose={() => history.push('/')}
            contentLabel="instillinger-modal"
            contentClass="innstillinger"
        >
            <Innholdslaster avhengigheter={[avhengigheter]}>
                <article className="innstillinger__container">
                    <Innholdstittel>
                        <FormattedMessage
                            id="innstillinger.modal.overskrift"
                            values={{ navn }}
                        />
                    </Innholdstittel>
                    <div className="innstillinger__innhold blokk-xs">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.startoppfolging.overskrift" />
                        </Systemtittel>
                    </div>
                    <AlertStripeSuksess className="blokk-m">
                        <FormattedMessage
                            id="innstillinger.modal.startoppfolging.kvittering"
                            values={{ navn }}
                        />
                    </AlertStripeSuksess>
                </article>
            </Innholdslaster>
        </Modal>
    );
}

StartOppfolgingKvittering.defaultProps = {
    navn: undefined,
};

StartOppfolgingKvittering.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    history: AppPT.history.isRequired,
    navn: PT.string,
};

const mapStateToProps = state => ({
    avhengigheter: [
        selectOppfolgingStatus(state),
        selectIdentitetStatus(state),
    ],
    navn: selectNavnPaMotpart(state),
});

export default connect(mapStateToProps)(StartOppfolgingKvittering);
