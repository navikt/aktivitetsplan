import NavFrontendModal from 'nav-frontend-modal';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { diffFromNowInMillis, isAfterNow, minusMinutes } from '../../utils';
import { hentGjenstaendeInnloggetTid } from './auth-reducer';
import { selectExpirationTime } from './auth-selector';
import TimeoutboxNedtelling from './timeoutbox-nedtelling';

import Timeout = NodeJS.Timeout;

interface Props {
    doHentGjenstaendeInnloggetTid: () => void;
    expirationTime: string | null;
}
interface State {
    manueltLukket: boolean;
}

class Timeoutbox extends Component<Props, State> {
    expirationPoll: Timeout | undefined;

    constructor(props: Props) {
        super(props);
        const { doHentGjenstaendeInnloggetTid } = this.props;
        doHentGjenstaendeInnloggetTid();
        this.state = {
            manueltLukket: false,
        };
    }

    componentDidUpdate() {
        const visningsTidspunkt = this.visningsTidspunkt();
        if (!visningsTidspunkt || this.expirationPoll) return;
        const expirationInMillis = diffFromNowInMillis(visningsTidspunkt);
        this.expirationPoll = setTimeout(() => {
            this.forceUpdate();
        }, expirationInMillis + 100);
    }

    componentWillUnmount() {
        if (!this.expirationPoll) return;
        clearTimeout(this.expirationPoll);
    }

    skalViseModal(): boolean {
        const { manueltLukket } = this.state;
        const visningsTidspunkt = this.visningsTidspunkt();
        return !!visningsTidspunkt && isAfterNow(visningsTidspunkt) && !manueltLukket;
    }

    visningsTidspunkt(): string | null {
        const { expirationTime } = this.props;
        if (expirationTime === null) return null;
        return minusMinutes(expirationTime, 5);
    }

    render() {
        const { expirationTime } = this.props;
        const skalVise = this.skalViseModal();
        const utlopsTidspunkt = expirationTime;
        if (!utlopsTidspunkt) {
            return null;
        }

        return (
            <NavFrontendModal
                isOpen={skalVise}
                shouldCloseOnOverlayClick={false}
                overlayClassName="aktivitet-modal__overlay"
                portalClassName="aktivitetsplanfs timeout-modal-portal"
                onRequestClose={() => {
                    this.setState({
                        manueltLukket: true,
                    });
                }}
                contentLabel="Advarsel om utlogging"
            >
                <TimeoutboxNedtelling utlopsTidspunkt={utlopsTidspunkt} />
            </NavFrontendModal>
        );
    }
}

const mapStateToProps = (state: any) => ({
    expirationTime: selectExpirationTime(state),
});

const mapDispatchToProps = (dispatch: any) => ({
    doHentGjenstaendeInnloggetTid: () => dispatch(hentGjenstaendeInnloggetTid()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Timeoutbox);
