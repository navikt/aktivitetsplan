import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Lenkeknapp from '../../felles-komponenter/utils/lenkeknapp';
import Filter from '../filtrering/filter';
import PeriodeFilter from '../filtrering/filter/periode-filter';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';
import InternLenke from '../../felles-komponenter/utils/internLenke';
import VisValgtFilter from '../filtrering/filter-vis-label';
import { selectHarTilgangTilAktiviteter } from '../aktivitet/aktivitet-selector';
import { hentDialog } from '../dialog/dialog-reducer';
import loggEvent, { APNE_NY_AKTIVITET, APNE_OM_TJENESTEN } from '../../felles-komponenter/utils/logging';

class Verktoylinje extends Component {
    componentDidMount() {
        const { doHentDialog } = this.props;
        doHentDialog();
    }

    render() {
        const { viserHistoriskPeriode, underOppfolging, harSkriveTilgang, aktivitetLaster } = this.props;
        return (
            <div className="verktoylinje">
                <div className="verktoylinje__verktoy-container">
                    <Lenkeknapp
                        type="hoved"
                        href="/aktivitet/ny"
                        className="ny-aktivitet-lenke"
                        disabled={!aktivitetLaster}
                        visible={!viserHistoriskPeriode && underOppfolging && harSkriveTilgang}
                        onClick={() => loggEvent(APNE_NY_AKTIVITET)}
                    >
                        Legg til aktivitet
                    </Lenkeknapp>
                </div>
                <div className="verktoylinje__verktoy-container">
                    <div className="indre">
                        <InternLenke
                            href="/informasjon"
                            className="knappelenke"
                            onClick={() => loggEvent(APNE_OM_TJENESTEN)}
                        >
                            <span>Om aktivitetsplanen</span>
                        </InternLenke>
                        <InternLenke href="/utskrift" className="knappelenke utskrift-lenke">
                            <span>Skriv ut</span>
                        </InternLenke>
                        <Filter className="verktoylinje__verktoy" />
                    </div>
                </div>
                <div className="verktoylinje__verktoy-container">
                    <VisValgtFilter />
                </div>
                <div className="verktoylinje__verktoy-container">
                    <PeriodeFilter className="verktoylinje__verktoy" skjulInneverende={!underOppfolging} />
                </div>
            </div>
        );
    }
}

Verktoylinje.propTypes = {
    viserHistoriskPeriode: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    aktivitetLaster: PT.bool.isRequired,
    harSkriveTilgang: PT.bool.isRequired,
    doHentDialog: PT.func.isRequired
};

const mapStateToProps = state => {
    const underOppfolging = selectErUnderOppfolging(state);
    const historiskPeriode = selectViserHistoriskPeriode(state);

    return {
        viserHistoriskPeriode: historiskPeriode,
        underOppfolging,
        harSkriveTilgang: selectHarSkriveTilgang(state),
        aktivitetLaster: selectHarTilgangTilAktiviteter(state)
    };
};

const mapDispatchToProps = dispatch => ({
    doHentDialog: () => dispatch(hentDialog())
});

export default connect(mapStateToProps, mapDispatchToProps)(Verktoylinje);
