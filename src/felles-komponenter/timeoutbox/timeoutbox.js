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
        hidden: false,
    };
};

class Timeoutbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            skalViseModal: false,
            tidIgjen: null,
            tidIgjenMoment: null,
        };
    }

    componentWillMount() {
        this.rerender = setInterval(() => {
            const tidSidenForrigeKall =
                Moment.now() - window.timeout.lastRequest;
            const tidIgjen = TIMEOUT_TID.asMilliseconds() - tidSidenForrigeKall;
            const tidIgjenMoment = Moment(tidIgjen);
            const skalViseModal =
                tidIgjen <= DISPLAY_TID.asMilliseconds() &&
                !window.timeout.hidden;

            this.setState({
                skalViseModal,
                tidIgjen,
                tidIgjenMoment,
            });
        }, 500);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.skalViseModal;
    }

    componentWillUnmount() {
        clearInterval(this.rerender);
    }

    render() {
        return (
            <NavFrontendModal
                isOpen={this.state.skalViseModal}
                shouldCloseOnOverlayClick={false}
                overlayClassName="aktivitet-modal__overlay"
                portalClassName="aktivitetsplanfs timeout-modal-portal"
                onRequestClose={() => {
                    window.timeout.hidden = true;
                }}
                contentLabel={this.props.intl.formatMessage({
                    id: 'timeoutbox.aria.label',
                })}
            >
                {this.state.tidIgjen > 0
                    ? <TimeoutboxNedtelling
                          tidIgjen={this.state.tidIgjenMoment}
                      />
                    : <TimeoutboxLoggetUt />}
            </NavFrontendModal>
        );
    }
}

Timeoutbox.propTypes = {
    intl: intlShape.isRequired,
};

export default injectIntl(Timeoutbox);
