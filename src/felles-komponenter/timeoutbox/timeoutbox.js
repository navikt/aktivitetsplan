import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import { injectIntl, intlShape } from 'react-intl';
import TimeoutboxNedtelling from './timeoutbox-nedtelling';
import TimeoutboxLoggetUt from './timeoutbox-logget-ut';
import { hentGjenstaendeInnloggetTid } from './auth-reducer';
import { selectAuthStatus, selectRemainingSeconds } from './auth-selector';
import { STATUS } from '../../ducks/utils';

const FEM_MINUTTER_I_SEKUNDER = 300;

class Timeoutbox extends Component {
    constructor(props) {
        super(props);
        this.props.doHentGjenstaendeInnloggetTid();
        this.state = {
            gjenstaendeTid: props.remainingSeconds,
            skalViseModal: false,
            manueltLukket: false,
        };
    }

    componentWillMount() {
        this.rerender = setInterval(() => {
            if (this.state.gjenstaendeTid == null && !this.props.laster) {
                this.setState({
                    gjenstaendeTid: this.props.remainingSeconds,
                });
            }

            let gjenstaendeTid = this.state.gjenstaendeTid;
            const skalViseModal =
                gjenstaendeTid < FEM_MINUTTER_I_SEKUNDER &&
                !this.state.manueltLukket;
            gjenstaendeTid -= 1;

            this.setState({
                gjenstaendeTid,
                skalViseModal,
            });
        }, 1000);
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
                    this.setState({
                        skalViseModal: false,
                        manueltLukket: true,
                    });
                }}
                contentLabel={this.props.intl.formatMessage({
                    id: 'timeoutbox.aria.label',
                })}
            >
                {this.state.gjenstaendeTid > 0
                    ? <TimeoutboxNedtelling
                          sekunderIgjen={this.state.gjenstaendeTid}
                      />
                    : <TimeoutboxLoggetUt />}
            </NavFrontendModal>
        );
    }
}

Timeoutbox.propTypes = {
    intl: intlShape.isRequired,
    doHentGjenstaendeInnloggetTid: PT.func.isRequired,
    remainingSeconds: PT.number,
    laster: PT.bool.isRequired,
};

Timeoutbox.defaultProps = {
    remainingSeconds: null,
};

const mapStateToProps = state => ({
    remainingSeconds: selectRemainingSeconds(state),
    laster: selectAuthStatus(state) !== STATUS.OK,
});

const mapDispatchToProps = dispatch => ({
    doHentGjenstaendeInnloggetTid: () =>
        dispatch(hentGjenstaendeInnloggetTid()),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(Timeoutbox)
);
