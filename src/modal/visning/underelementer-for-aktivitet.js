import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { ToggleGruppe, ToggleKnapp } from 'nav-frontend-toggle';
import * as AppPT from '../../proptypes';
import { autobind } from '../../utils';
import EndringsloggForAktivitet from './endringslogg-for-aktivitet';
import TallAlert from '../../felles-komponenter/tall-alert';
import NyHenvendelse from '../../dialog/ny-henvendelse';
import Henvendelser from '../../dialog/henvendelser';
import './underelementer-for-aktivitet.less';
import VisibleDiv from '../../felles-komponenter/utils/visible-if-div';
import VisibleIfHOC from '../../hocs/visible-if';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../constant';

const DIALOG = 'dialog';
const HISTORIKK = 'historikk';

const VisibleIfNyHenvendelse = VisibleIfHOC(NyHenvendelse);

class UnderelementerForAktivitet extends Component {

    constructor() {
        super();
        autobind(this);
        this.state = {};
    }

    toggleDialog() {
        this.setState({
            vis: DIALOG
        });
    }

    toggleHistorikk() {
        this.setState({
            vis: HISTORIKK
        });
    }

    render() {
        const { aktivitet, antallUlesteHenvendelser, dialog, className } = this.props;
        const { vis } = this.state;
        const aktivitetId = aktivitet.id;
        const visDialog = vis === DIALOG;
        const skjulNyHenvendelse = aktivitet.status === STATUS_FULLFOERT || aktivitet.status === STATUS_AVBRUTT;
        const cls = (classes) => classNames('underelementer-aktivitet', classes);
        const visHistorikk = vis === HISTORIKK;

        const dialogknappCls = (dialogAktiv) => classNames('underelementer-aktivitet__dialog-knapp', {
            'underelementer-aktivitet__dialog-knapp--aktiv': dialogAktiv
        });

        const historikknappCls = (historikkAktiv) => classNames('underelementer-aktivitet__historikk-knapp', {
            'underelementer-aktivitet__historikk-knapp--aktiv': historikkAktiv
        });

        const toggleVis = (e) => {
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
                    <ToggleKnapp
                        value={DIALOG}
                        className={dialogknappCls(visDialog)}
                    >
                        <FormattedMessage id="aktivitetvisning.dialog-knapp" />
                        <TallAlert visible={antallUlesteHenvendelser > 0}>{antallUlesteHenvendelser}</TallAlert>
                    </ToggleKnapp>
                    <ToggleKnapp
                        value={HISTORIKK}
                        className={historikknappCls(visHistorikk)}
                    >
                        <FormattedMessage id="aktivitetvisning.historikk-knapp" />
                    </ToggleKnapp>
                </ToggleGruppe>

                <EndringsloggForAktivitet
                    visible={visHistorikk}
                    aktivitet={aktivitet}
                    className="underelementer-aktivitet__historikkvisning"
                />

                <VisibleDiv visible={visDialog} className="underelementer-aktivitet__dialogvisning">
                    <VisibleIfNyHenvendelse
                        formNavn={`ny-henvendelse-aktivitet-${aktivitetId}`}
                        dialogId={dialog && dialog.id}
                        aktivitetId={aktivitetId}
                        visible={!skjulNyHenvendelse}
                    />
                    <Henvendelser visible={!!dialog} dialog={dialog} />
                </VisibleDiv>
            </section>
        );
    }
}


UnderelementerForAktivitet.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    dialog: AppPT.dialog,
    antallUlesteHenvendelser: PT.number.isRequired,
    className: PT.string
};

UnderelementerForAktivitet.defaultProps = {
    className: '',
    dialog: undefined
};

const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet;
    const stateData = state.data;
    const dialoger = stateData.dialog.data;
    const dialog = dialoger.find((d) => d.aktivitetId === aktivitet.id);
    const antallUlesteHenvendelser = dialog ? dialog.henvendelser.filter((h) => !h.lest).length : 0;
    return {
        dialog,
        antallUlesteHenvendelser,
        endringslogg: stateData.endringslogg.data
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UnderelementerForAktivitet);
