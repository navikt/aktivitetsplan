import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { ToggleGruppe, ToggleKnapp } from 'nav-frontend-toggle';
import * as AppPT from '../../../../proptypes';
import { autobind } from '../../../../utils';
import VersjonerForAktivitet from '../versjoner/versjoner-for-aktivitet';
import TallAlert from '../../../../felles-komponenter/tall-alert';
import NyHenvendelse from '../../../../dialog/ny-henvendelse';
import Henvendelser from '../../../../dialog/henvendelser';
import EndreDialog from '../../../../dialog/endre-dialog';
import VisibleDiv from '../../../../felles-komponenter/utils/visible-if-div';
import hiddenIfHoc from '../../../../felles-komponenter/hidden-if/hidden-if';
import { selectErUnderOppfolging } from '../../../situasjon/situasjon-selector';

const DIALOG = 'dialog';
const HISTORIKK = 'historikk';

const HiddenIfToggleKnapp = hiddenIfHoc(ToggleKnapp);

class UnderelementerForAktivitet extends Component {
    constructor() {
        super();
        autobind(this);
        this.state = {};
    }

    toggleDialog() {
        this.setState({
            vis: DIALOG,
        });
    }

    toggleHistorikk() {
        this.setState({
            vis: HISTORIKK,
        });
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

        const toggleVis = e => {
            if (e.target.value === HISTORIKK) {
                this.toggleHistorikk();
            } else if (e.target.value === DIALOG) {
                this.toggleDialog();
            }
        };

        return (
            <section className={cls(className)}>
                <ToggleGruppe
                    name="dialog-historikk-toggle"
                    onChange={toggleVis}
                    className="underelementer-aktivitet__toggle"
                >
                    <HiddenIfToggleKnapp
                        value={DIALOG}
                        className={dialogknappCls(visDialog)}
                        hidden={!kanSeDialog}
                    >
                        <FormattedMessage id="aktivitetvisning.dialog-knapp" />
                        <TallAlert hidden={antallUlesteHenvendelser <= 0}>
                            {antallUlesteHenvendelser}
                        </TallAlert>
                    </HiddenIfToggleKnapp>
                    <ToggleKnapp
                        value={HISTORIKK}
                        className={historikknappCls(visHistorikk)}
                    >
                        <FormattedMessage id="aktivitetvisning.historikk-knapp" />
                    </ToggleKnapp>
                </ToggleGruppe>

                <VersjonerForAktivitet
                    visible={visHistorikk}
                    aktivitet={aktivitet}
                    className="underelementer-aktivitet__historikkvisning"
                />

                <VisibleDiv
                    visible={visDialog}
                    className="underelementer-aktivitet__dialogvisning"
                >
                    <NyHenvendelse
                        formNavn={`ny-henvendelse-aktivitet-${aktivitetId}`}
                        dialogId={dialog && dialog.id}
                        hidden={!kanOppretteNyHenvendelse}
                        aktivitetId={aktivitetId}
                    />
                    <EndreDialog
                        hidden={!kanEndreDialog}
                        formNavn={`dialog-aktivitet-${aktivitetId}`}
                        dialog={dialog}
                    />
                    <Henvendelser hidden={!dialog} dialog={dialog} />
                </VisibleDiv>
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
    const stateData = state.data;
    const dialoger = stateData.dialog.data;
    const dialog = dialoger.find(d => d.aktivitetId === aktivitet.id);
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
