import React, { Component } from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { injectIntl, intlShape } from 'react-intl';
import Moment from 'moment';
import TimeoutboxNedtelling from './timeoutbox-nedtelling';
import TimeoutboxLoggetUt from './timeoutbox-logget-ut';

const TIMEOUT_TID = Moment.duration(30, 'minutes');
const DISPLAY_TID = Moment.duration(5, 'minutes');

export const update = () => {
    window.timeout = {
        lastRequest: Moment.now(),
        hidden: false
    };
};

class Timeoutbox extends Component {
    componentWillMount() {
        this.rerender = setInterval(() => this.forceUpdate(), 250);
    }

    componentWillUnmount() {
        clearInterval(this.rerender);
    }

    render() {
        const tidSidenForrigeKall = Moment.now() - window.timeout.lastRequest;
        const tidIgjen = TIMEOUT_TID.asMilliseconds() - tidSidenForrigeKall;
        const tidIgjenMoment = Moment(tidIgjen);

        const skalViseModal = tidIgjen <= DISPLAY_TID.asMilliseconds() && !window.timeout.hidden;

        return (
            <NavFrontendModal
                isOpen={skalViseModal}
                shouldCloseOnOverlayClick={false}
                overlayClassName="aktivitet-modal__overlay"
                portalClassName="timeout-modal-portal"
                onRequestClose={() => { window.timeout.hidden = true; }}
                contentLabel={this.props.intl.formatMessage({ id: 'timeoutbox.aria.label' })}
            >
                {tidIgjen > 0 ? <TimeoutboxNedtelling tidIgjen={tidIgjenMoment} /> : <TimeoutboxLoggetUt /> }
            </NavFrontendModal>
        );
    }
}

Timeoutbox.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(Timeoutbox);
