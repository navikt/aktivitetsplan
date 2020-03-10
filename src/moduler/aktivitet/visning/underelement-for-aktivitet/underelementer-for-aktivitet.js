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
import hiddenIfHOC, {
    div as HiddenIfDiv,
    span as HiddenIfSpan,
    button as HiddenIfButton
} from '../../../../felles-komponenter/hidden-if/hidden-if';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { selectDialogFeilmeldinger, selectDialogForAktivitetId } from '../../../dialog/dialog-selector';
import getScrollParent from '../../../../utils/getScrollParent';
import { toggleDialog, toggleHistorikk } from './underelementer-view-reducer';
import Feilmelding from '../../../feilmelding/feilmelding';
import { selectVisDialog, selectVisHistorikk } from './underelementer-view-selector';
import loggEvent, {
    APNE_AKTIVITET_HISTORIK,
    OPNE_DIALOG_I_AKTIVITET_METRIKK
} from '../../../../felles-komponenter/utils/logging';
import { selectErVeileder } from '../../../identitet/identitet-selector';

const LOGGING_ANTALLBRUKERE = 'aktivitetskort.antallBrukere.dialog';

function loggingAntallBrukere(typeEvent, hvem) {
    const { erVeileder } = hvem;
    if (erVeileder !== undefined && erVeileder !== null) {
        loggEvent(typeEvent, hvem);
    }
}

const DIALOG = 'dialog';
const HISTORIKK = 'historikk';

class UnderelementerForAktivitet extends Component {
    constructor() {
        super();
        autobind(this);
        this.me = null;
    }

    componentDidUpdate(prevProps) {
        this.scrollMeIntoView();
        const { visHistorikk, visDialog, erVeileder } = this.props;
        if (visDialog !== prevProps.visDialog) {
            if (visDialog) {
                loggingAntallBrukere(LOGGING_ANTALLBRUKERE, { erVeileder });
            }
        }
        if (visHistorikk !== prevProps.visHistorikk) {
            loggEvent(APNE_AKTIVITET_HISTORIK);
        }
    }

    scrollMeIntoView() {
        const { visHistorikk, visDialog } = this.props;
        if (this.me && (visHistorikk || visDialog)) {
            setTimeout(() => (getScrollParent(this.me).scrollTop = this.me.offsetTop), 0);
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
            doToggleDialog,
            doToggleHistorikk,
            visDialog,
            visHistorikk,
            dialogFeilmeldinger
        } = this.props;

        const tolgeDialog = () => {
            doToggleDialog();
            loggEvent(OPNE_DIALOG_I_AKTIVITET_METRIKK);
        };

        const aktivitetId = aktivitet.id;
        const cls = classes => classNames('underelementer-aktivitet', classes);
        const dialogknappCls = dialogAktiv =>
            classNames('underelementer-aktivitet__dialog-knapp', {
                'underelementer-aktivitet__dialog-knapp--aktiv': dialogAktiv
            });

        const historikknappCls = historikkAktiv =>
            classNames('underelementer-aktivitet__historikk-knapp', {
                'underelementer-aktivitet__historikk-knapp--aktiv': historikkAktiv
            });
        const underelementId = `underelementer-aktivitet__dialogvisning-${aktivitetId}`;
        return (
            <section ref={me => (this.me = me)} className={cls(className)}>
                <div className="velgVisning">
                    <HiddenIfButton
                        hidden={!kanSeDialog}
                        value={DIALOG}
                        className={dialogknappCls(visDialog)}
                        onClick={tolgeDialog}
                        aria-pressed={visDialog}
                    >
                        <FormattedMessage id="aktivitetvisning.dialog-knapp" />
                        <HiddenIfSpan hidden={!kanSeDialog || antallUlesteHenvendelser <= 0} className="tall-alert">
                            {antallUlesteHenvendelser}
                        </HiddenIfSpan>
                    </HiddenIfButton>

                    <HiddenIfButton
                        hidden={aktivitet.arenaAktivitet}
                        value={HISTORIKK}
                        className={historikknappCls(visHistorikk)}
                        onClick={doToggleHistorikk}
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
                    <Feilmelding feilmeldinger={dialogFeilmeldinger} />
                    <EndreDialog hidden={!kanEndreDialog} dialog={dialog} />
                    <NyHenvendelse
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
    className: PT.string
};

UnderelementerForAktivitet.defaultProps = {
    className: '',
    dialog: undefined,
    dialogFeilmeldinger: []
};

const mapStateToProps = (state, props) => {
    const { aktivitet } = props;
    const dialog = selectDialogForAktivitetId(state, aktivitet.id);
    const harDialog = !!dialog;
    const antallUlesteHenvendelser = harDialog ? dialog.henvendelser.filter(h => !h.lest).length : 0;

    const historiskAktivitet = aktivitet.historisk;
    const historiskDialog = harDialog && dialog.historisk;
    const underOppfolging = selectErUnderOppfolging(state);

    const kanSeDialog = underOppfolging || (historiskAktivitet && harDialog);
    const kanOppretteNyHenvendelse = kanSeDialog && !(historiskDialog || historiskAktivitet);
    const kanEndreDialog = kanOppretteNyHenvendelse && harDialog;
    return {
        dialog,
        antallUlesteHenvendelser,
        kanSeDialog,
        kanOppretteNyHenvendelse,
        kanEndreDialog,
        visDialog: selectVisDialog(state),
        visHistorikk: selectVisHistorikk(state),
        dialogFeilmeldinger: selectDialogFeilmeldinger(state),
        erVeileder: selectErVeileder(state)
    };
};

const mapDispatchToProps = dispatch => ({
    doToggleDialog: () => dispatch(toggleDialog()),
    doToggleHistorikk: () => dispatch(toggleHistorikk())
});

export default hiddenIfHOC(connect(mapStateToProps, mapDispatchToProps)(UnderelementerForAktivitet));
