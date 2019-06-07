import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Lenkeknapp from '../../felles-komponenter/utils/lenkeknapp';
import Filter from '../filtrering/filter';
import PeriodeFilter from '../filtrering/filter/periode-filter';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectErVeileder } from '../identitet/identitet-selector';
import {
    selectErUnderOppfolging,
    selectHarSkriveTilgang,
} from '../oppfolging-status/oppfolging-selector';
import TallAlert from '../../felles-komponenter/tall-alert';
import UtskriftKnapp from './utskriftknapp';
import {
    selectDialoger,
    selectHarTilgangTilDialog,
} from "../dialog/dialog-selector";
import { dialogFilter } from "../filtrering/filter/filter-utils";
import { div as HiddenIfDiv } from '../../felles-komponenter/hidden-if/hidden-if';
import Lenke from '../../felles-komponenter/utils/lenke';
import VisValgtFilter from "../filtrering/filter-vis-label";
import { selectHarTilgangTilAktiviteter } from '../aktivitet/aktivitet-selector';
import { hentDialog } from '../dialog/dialog-reducer';

const knapplenkeCls = (className, disabled) =>
    classNames(className, {
        knappelenke: !disabled,
        'knappelenke knappelenke--disabled': disabled,
    });

class Verktoylinje extends Component {
    componentDidMount() {
        const {doHentDialog} = this.props;
        doHentDialog();
    }

    render() {
        const {
            viserHistoriskPeriode,
            underOppfolging,
            harSkriveTilgang,
            antallUlesteDialoger,
            aktivitetLaster,
            dialogLaster,
        } = this.props;
        return (
            <div className="verktoylinje">
                <div className="verktoylinje__verktoy-container">
                    <Lenke
                        href="/dialog"
                        className={knapplenkeCls(
                            'aktivitetskort__henvendelser',
                            !dialogLaster
                        )}
                        disabled={!dialogLaster}
                        aria-live="polite"
                    >
                        <TallAlert hidden={antallUlesteDialoger <= 0}>
                            {antallUlesteDialoger}
                        </TallAlert>
                        <HiddenIfDiv
                            hidden={antallUlesteDialoger > 0}
                            className="sr-only"
                        >
                            <FormattedMessage id="aktivitetskort-dialog-tidligere-meldinger" />
                        </HiddenIfDiv>
                        <FormattedMessage id="navigasjon.dialog" />
                    </Lenke>
                    <Lenkeknapp
                        type="big-hoved"
                        href="/aktivitet/ny"
                        disabled={
                            viserHistoriskPeriode ||
                            !underOppfolging ||
                            !aktivitetLaster ||
                            !harSkriveTilgang
                        }
                    >
                        <FormattedMessage id="nyaktivitetsknapp" />
                    </Lenkeknapp>
                </div>
                <div className="verktoylinje__verktoy-container">
                    <div className="indre">
                        <Lenke href="/informasjon" className="knappelenke">
                            <FormattedMessage id="navigasjon.informasjon" />
                        </Lenke>
                        <UtskriftKnapp
                            ariaLabel="utskrift.ikon.alt.tekst"
                            lenke="/utskrift"
                            className="verktoylinje__print-knapp"
                        />
                        <Filter className="verktoylinje__verktoy" />
                    </div>
                </div>
                <div className="verktoylinje__verktoy-container">
                    <VisValgtFilter />
                </div>
                <div className="verktoylinje__verktoy-container">
                    <PeriodeFilter
                        className="verktoylinje__verktoy"
                        skjulInneverende={!underOppfolging}
                    />
                </div>
            </div>
        );
    }
}

Verktoylinje.propTypes = {
    viserHistoriskPeriode: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    erVeileder: PT.bool.isRequired,
    aktivitetLaster: PT.bool.isRequired,
    dialogLaster: PT.bool.isRequired,
    harSkriveTilgang: PT.bool.isRequired,
    antallUlesteDialoger: PT.number.isRequired,
    doHentDialog: PT.func.isRequired,
};

const mapStateToProps = state => {
    const dialoger = selectDialoger(state)
        .filter(d => !d.lest)
        .filter(d => dialogFilter(d, state)).length;
    const underOppfolging = selectErUnderOppfolging(state);
    const historiskPeriode = selectViserHistoriskPeriode(state);

    return {
        viserHistoriskPeriode: historiskPeriode,
        underOppfolging,
        erVeileder: selectErVeileder(state),
        harSkriveTilgang: selectHarSkriveTilgang(state),
        antallUlesteDialoger: dialoger,
        aktivitetLaster: selectHarTilgangTilAktiviteter(state),
        dialogLaster: selectHarTilgangTilDialog(state),
    };
};

const mapDispatchToProps = dispatch => ({
    doHentDialog: () => dispatch(hentDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Verktoylinje);
