import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import { injectIntl, intlShape } from 'react-intl';
import TimeoutboxNedtelling from './timeoutbox-nedtelling';
import { hentGjenstaendeInnloggetTid } from './auth-reducer';
import { selectExpirationTime } from './auth-selector';
import { moment } from './../../utils';

class Timeoutbox extends Component {
    constructor(props) {
        super(props);
        this.props.doHentGjenstaendeInnloggetTid();
        this.state = {
            manueltLukket: false,
        };
    }

    componentDidUpdate() {
        const expirationTime = this.props.expirationTime;
        if (!this.timeout && expirationTime) {
            const expirationInMillis = this.visningsTidspunkt().diff(
                moment(),
                'ms'
            );
            this.timeout = setTimeout(() => {
                this.forceUpdate();
            }, expirationInMillis + 100);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    skalViseModal() {
        return (
            moment().isAfter(this.visningsTidspunkt()) &&
            !this.state.manueltLukket
        );
    }

    visningsTidspunkt() {
        return moment(this.props.expirationTime).subtract(5, 'minutes');
    }

    render() {
        const skalVise = this.skalViseModal();
        const utlopsTidspunkt = this.props.expirationTime;
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
                contentLabel={this.props.intl.formatMessage({
                    id: 'timeoutbox.aria.label',
                })}
            >
                <TimeoutboxNedtelling utlopsTidspunkt={utlopsTidspunkt} />
            </NavFrontendModal>
        );
    }
}

Timeoutbox.propTypes = {
    intl: intlShape.isRequired,
    doHentGjenstaendeInnloggetTid: PT.func.isRequired,
    expirationTime: PT.string,
};

Timeoutbox.defaultProps = {
    expirationTime: null,
};

const mapStateToProps = state => ({
    expirationTime: selectExpirationTime(state),
});

const mapDispatchToProps = dispatch => ({
    doHentGjenstaendeInnloggetTid: () =>
        dispatch(hentGjenstaendeInnloggetTid()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(Timeoutbox)
);
