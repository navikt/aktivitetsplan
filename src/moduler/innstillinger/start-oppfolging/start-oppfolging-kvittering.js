import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import PT from 'prop-types';
import Modal from '../../../felles-komponenter/modal/modal';
import history from '../../../history';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../../proptypes';
import { selectPrivatModusStatus } from '../../privat-modus/privat-modus-selector';
import { selectNavnPaMotpart } from '../../motpart/motpart-selector';

function StartOppfolgingKvittering({ avhengigheter, navn }) {
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
    navn: PT.string,
};

const mapStateToProps = state => ({
    avhengigheter: selectPrivatModusStatus(state),
    navn: selectNavnPaMotpart(state),
});

export default connect(mapStateToProps)(StartOppfolgingKvittering);
