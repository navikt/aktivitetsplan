import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';
import { selectDialoger, selectHarTilgangTilDialog } from '../dialog/dialog-selector';
import { dialogFilter } from '../filtrering/filter/filter-utils';
import { selectHarTilgangTilAktiviteter } from '../aktivitet/aktivitet-selector';
import { hentDialog } from '../dialog/dialog-reducer';
import { DialogLenkeToggel } from './DialogLenkeToggel';
import Lenke from 'nav-frontend-lenker';
import { selectErVeileder } from '../identitet/identitet-selector';
import { VenstreChevron } from 'nav-frontend-chevron';

const DITTNAV_PATH = '/dittnav/';

class Navigasjonslinje extends Component {
    componentDidMount() {
        const { doHentDialog } = this.props;
        doHentDialog();
    }

    render() {
        const { erVeileder, antallUlesteDialoger, dialogLaster } = this.props;
        if (erVeileder) {
            return null;
        } else {
            return (
                <div className="navigasjonslinje">
                    <Lenke className="dittNav" href={DITTNAV_PATH}>
                        <span>
                            <VenstreChevron /> Ditt NAV
                        </span>
                    </Lenke>

                    <div className="navigasjonslinje__navigasjon-container">
                        <DialogLenkeToggel dialogLaster={dialogLaster} antallUlesteDialoger={antallUlesteDialoger} />
                    </div>
                </div>
            );
        }
    }
}

Navigasjonslinje.propTypes = {
    erVeileder: PT.bool.isRequired,
    viserHistoriskPeriode: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    aktivitetLaster: PT.bool.isRequired,
    dialogLaster: PT.bool.isRequired,
    harSkriveTilgang: PT.bool.isRequired,
    antallUlesteDialoger: PT.number.isRequired,
    doHentDialog: PT.func.isRequired
};

const mapStateToProps = state => {
    const dialoger = selectDialoger(state)
        .filter(d => !d.lest)
        .filter(d => dialogFilter(d, state)).length;
    const underOppfolging = selectErUnderOppfolging(state);
    const historiskPeriode = selectViserHistoriskPeriode(state);

    return {
        erVeileder: selectErVeileder(state),
        viserHistoriskPeriode: historiskPeriode,
        underOppfolging,
        harSkriveTilgang: selectHarSkriveTilgang(state),
        antallUlesteDialoger: dialoger,
        aktivitetLaster: selectHarTilgangTilAktiviteter(state),
        dialogLaster: selectHarTilgangTilDialog(state)
    };
};

const mapDispatchToProps = dispatch => ({
    doHentDialog: () => dispatch(hentDialog())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigasjonslinje);
