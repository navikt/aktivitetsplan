import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Knapp from 'nav-frontend-knapper/src/knapp';
import * as AppPT from '../../proptypes';
import { autobind } from '../../utils';
import { visibleIfHOC } from '../../hocs/visible-if';
import EndringsloggForAktivitet from './endringslogg-for-aktivitet';
import TallAlert from '../../felles-komponenter/tall-alert';
import NyHenvendelse from '../../dialog/ny-henvendelse';
import Henvendelser from '../../dialog/henvendelser';
import './underelementer-for-aktivitet.less';

const VisibleDiv = visibleIfHOC((props) => <div {...props} />);

const DIALOG = 'dialog';
const HISTORIKK = 'historikk';

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
        const visHistorikk = vis === HISTORIKK;
        const visDialog = vis === DIALOG;
        const cls = (classes) => classNames('underelementer-aktivitet', classes);
        return (
            <section className={cls(className)}>
                <Knapp
                    className={`underelementer-aktivitet__dialog-knapp ${visDialog && 'underelementer-aktivitet__dialog-knapp--aktiv'}`}
                    onClick={this.toggleDialog}
                >
                    <span><FormattedMessage id="aktivitetvisning.dialog-knapp" /></span>
                    <TallAlert visible={antallUlesteHenvendelser > 0}>{antallUlesteHenvendelser}</TallAlert>
                </Knapp>
                <Knapp
                    className={`underelementer-aktivitet__historikk-knapp ${visHistorikk && 'underelementer-aktivitet__historikk-knapp--aktiv'}`}
                    onClick={this.toggleHistorikk}
                ><FormattedMessage id="aktivitetvisning.historikk-knapp" /></Knapp>

                <EndringsloggForAktivitet visible={visHistorikk} aktivitet={aktivitet} />

                <VisibleDiv visible={visDialog}>
                    <NyHenvendelse
                        formNavn={`ny-henvendelse-aktivitet-${aktivitetId}`} dialogId={dialog && dialog.id}
                        aktivitetId={aktivitetId}
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
