import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import * as AppPT from '../../../../proptypes';
import { autobind } from '../../../../utils';
import VersjonerForAktivitet from '../versjoner/versjoner-for-aktivitet';
import NyHenvendelse from '../../../dialog/dialog-modal/ny-henvendelse';
import Henvendelser from '../../../dialog/dialog-modal/henvendelser';
import EndreDialog from '../../../dialog/dialog-modal/endre-dialog';
import {
    div as HiddenIfDiv,
    span as HiddenIfSpan,
    button as HiddenIfButton,
} from '../../../../felles-komponenter/hidden-if/hidden-if';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { selectDialogForAktivitetId } from '../../../dialog/dialog-selector';
import getScrollParent from '../../../../utils/getScrollParent';

const DIALOG = 'dialog';
const HISTORIKK = 'historikk';
const INGEN = '';

class UnderelementerForAktivitet extends Component {
    constructor() {
        super();
        autobind(this);
        this.state = {};
        this.me = null;
    }

    scrollMeIntoView() {
        console.log(getScrollParent(this.me));
        if (this.me) {
            setTimeout(
                () => getScrollParent(this.me).scrollTo(0, this.me.offsetTop),
                0
            );
        }
    }

    toggleDialog() {
        if (this.state.vis === DIALOG) {
            this.setState({
                vis: INGEN,
            });
        } else {
            this.setState(
                {
                    vis: DIALOG,
                },
                this.scrollMeIntoView
            );
        }
    }

    toggleHistorikk() {
        if (this.state.vis === HISTORIKK) {
            this.setState({
                vis: INGEN,
            });
        } else {
            this.setState(
                {
                    vis: HISTORIKK,
                },
                this.scrollMeIntoView
            );
        }
    }

    render() {
        const {
            aktivitet,
            antallUlesteHenvendelser,
            dialog,
            className,
            kanSeDialog,
            kanOppretteNyHenvendelse,
            kanEndreDialog,
        } = this.props;

        const { vis } = this.state;
        const aktivitetId = aktivitet.id;
        const cls = classes => classNames('underelementer-aktivitet', classes);

        const visDialog = vis === DIALOG;
        const visHistorikk = vis === HISTORIKK;

        const dialogknappCls = dialogAktiv =>
            classNames('underelementer-aktivitet__dialog-knapp', {
                'underelementer-aktivitet__dialog-knapp--aktiv': dialogAktiv,
            });

        const historikknappCls = historikkAktiv =>
            classNames('underelementer-aktivitet__historikk-knapp', {
                'underelementer-aktivitet__historikk-knapp--aktiv': historikkAktiv,
            });
        const underelementId = `underelementer-aktivitet__dialogvisning-${aktivitetId}`;
        return (
            <section ref={me => (this.me = me)} className={cls(className)}>
                <div className="velgVisning">
                    <HiddenIfButton
                        hidden={!kanSeDialog}
                        value={DIALOG}
                        className={dialogknappCls(visDialog)}
                        onClick={this.toggleDialog}
                        aria-pressed={visDialog}
                    >
                        <FormattedMessage id="aktivitetvisning.dialog-knapp" />
                        <HiddenIfSpan
                            hidden={
                                !kanSeDialog || antallUlesteHenvendelser <= 0
                            }
                            className="tall-alert"
                        >
                            {antallUlesteHenvendelser}
                        </HiddenIfSpan>
                    </HiddenIfButton>

                    <HiddenIfButton
                        hidden={aktivitet.arenaAktivitet}
                        value={HISTORIKK}
                        className={historikknappCls(visHistorikk)}
                        onClick={this.toggleHistorikk}
                        aria-pressed={visHistorikk}
                    >
                        <FormattedMessage id="aktivitetvisning.historikk-knapp" />
                    </HiddenIfButton>
                </div>

                <VersjonerForAktivitet
                    visible={visHistorikk}
                    aktivitet={aktivitet}
                    className="underelementer-aktivitet__historikkvisning"
                />

                <HiddenIfDiv
                    hidden={!visDialog}
                    className="underelementer-aktivitet__dialogvisning"
                    id={underelementId}
                >
                    <EndreDialog
                        hidden={!kanEndreDialog}
                        formNavn={`dialog-aktivitet-${aktivitetId}`}
                        dialog={dialog}
                    />
                    <NyHenvendelse
                        formNavn={`ny-henvendelse-aktivitet-${aktivitetId}`}
                        dialogId={dialog && dialog.id}
                        hidden={!kanOppretteNyHenvendelse}
                        aktivitetId={aktivitetId}
                        scrollElementId={underelementId}
                    />
                    <Henvendelser hidden={!dialog} dialog={dialog} />
                </HiddenIfDiv>
            </section>
        );
    }
}

UnderelementerForAktivitet.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    dialog: AppPT.dialog,
    antallUlesteHenvendelser: PT.number.isRequired,
    kanSeDialog: PT.bool.isRequired,
    kanOppretteNyHenvendelse: PT.bool.isRequired,
    kanEndreDialog: PT.bool.isRequired,
    className: PT.string,
};

UnderelementerForAktivitet.defaultProps = {
    className: '',
    dialog: undefined,
};

const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet;
    const dialog = selectDialogForAktivitetId(state, aktivitet.id);
    const harDialog = !!dialog;
    const antallUlesteHenvendelser = harDialog
        ? dialog.henvendelser.filter(h => !h.lest).length
        : 0;

    const historiskAktivitet = aktivitet.historisk;
    const historiskDialog = harDialog && dialog.historisk;
    const underOppfolging = selectErUnderOppfolging(state);

    const kanSeDialog = underOppfolging || (historiskAktivitet && harDialog);
    const kanOppretteNyHenvendelse =
        kanSeDialog && !(historiskDialog || historiskAktivitet);
    const kanEndreDialog = kanOppretteNyHenvendelse && harDialog;
    return {
        dialog,
        antallUlesteHenvendelser,
        kanSeDialog,
        kanOppretteNyHenvendelse,
        kanEndreDialog,
    };
};

export default connect(mapStateToProps)(UnderelementerForAktivitet);
