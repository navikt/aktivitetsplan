import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import moment from 'moment';
import TimeoutboxNedtelling from './timeoutbox-nedtelling';
import { hentGjenstaendeInnloggetTid } from './auth-reducer';
import { selectExpirationTime } from './auth-selector';

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
            const expirationInMillis = this.visningsTidspunkt().diff(moment(), 'ms');
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
        return moment().isAfter(this.visningsTidspunkt()) && !manueltLukket;
    }

    visningsTidspunkt() {
        const { expirationTime } = this.props;
        return moment(expirationTime).subtract(5, 'minutes');
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
