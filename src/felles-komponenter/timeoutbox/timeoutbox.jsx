import { Modal } from '@navikt/ds-react';
import { differenceInMilliseconds, isAfter, parseISO, subMinutes } from 'date-fns';
import PT from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { hentGjenstaendeInnloggetTid } from './auth-reducer';
import { selectExpirationTime } from './auth-selector';
import TimeoutboxNedtelling from './timeoutbox-nedtelling';

class Timeoutbox extends Component {
    constructor(props) {
        super(props);
        const { doHentGjenstaendeInnloggetTid } = this.props;
        doHentGjenstaendeInnloggetTid();
        this.state = {
            manueltLukket: false,
        };
    }

    componentDidUpdate() {
        const { expirationTime } = this.props;
        if (!this.timeout && expirationTime) {
            const expirationInMillis = differenceInMilliseconds(this.visningsTidspunkt(), new Date());
            this.timeout = setTimeout(() => {
                this.forceUpdate();
            }, expirationInMillis + 100);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    skalViseModal() {
        const { manueltLukket } = this.state;
        return isAfter(new Date(), this.visningsTidspunkt()) && !manueltLukket;
    }

    visningsTidspunkt() {
        const { expirationTime } = this.props;
        return subMinutes(parseISO(expirationTime), 5);
    }

    render() {
        const { expirationTime } = this.props;
        const skalVise = this.skalViseModal();
        const utlopsTidspunkt = expirationTime;
        if (!utlopsTidspunkt) {
            return null;
        }

        return (
            <Modal
                open={skalVise}
                className="aktivitetsplanfs timeout-modal-portal max-w-2xl"
                shouldCloseOnOverlayClick={false}
                overlayClassName="aktivitet-modal__overlay"
                onClose={() => {
                    this.setState({
                        manueltLukket: true,
                    });
                }}
            >
                <TimeoutboxNedtelling utlopsTidspunkt={utlopsTidspunkt} />
            </Modal>
        );
    }
}

Timeoutbox.propTypes = {
    doHentGjenstaendeInnloggetTid: PT.func.isRequired,
    expirationTime: PT.string,
};

Timeoutbox.defaultProps = {
    expirationTime: null,
};

const mapStateToProps = (state) => ({
    expirationTime: selectExpirationTime(state),
});

const mapDispatchToProps = (dispatch) => ({
    doHentGjenstaendeInnloggetTid: () => dispatch(hentGjenstaendeInnloggetTid()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Timeoutbox);
