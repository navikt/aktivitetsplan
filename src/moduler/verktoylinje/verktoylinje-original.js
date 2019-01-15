import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Lenkeknapp from '../../felles-komponenter/utils/lenkeknapp';
import Filter from '../filtrering/filter';
import PeriodeFilter from '../filtrering/filter/periode-filter';
import {
    erPrivateBrukerSomSkalSkrusAv,
    selectErPrivatModus,
} from '../privat-modus/privat-modus-selector';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectErVeileder } from '../identitet/identitet-selector';
import { selectHarTilgangTilAktiviteter } from '../aktivitet/aktivitet-selector';
import { selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';

function Verktoylinje({
    viserHistoriskPeriode,
    harTilgangTilAktiviteter,
    privatModus,
    erVeileder,
    harSkriveTilgang,
    erPrivatBruker,
}) {
    return (
        <div className="verktoylinje-original">
            <div className="verktoylinje-original__verktoy">
                <Lenkeknapp
                    type="big-hoved"
                    href="/aktivitet/ny"
                    disabled={
                        viserHistoriskPeriode ||
                        privatModus ||
                        erPrivatBruker ||
                        !harTilgangTilAktiviteter ||
                        !harSkriveTilgang
                    }
                >
                    <FormattedMessage id="nyaktivitetsknapp" />
                </Lenkeknapp>
            </div>
            <div className="verktoylinje-original__verktoy-container">
                <PeriodeFilter
                    className="verktoylinje-original__verktoy"
                    skjulInneverende={privatModus && erVeileder}
                />
                <Filter
                    className="verktoylinje-original__verktoy"
                    skjulIPrivatModus={
                        !viserHistoriskPeriode && privatModus && erVeileder
                    }
                />
            </div>
        </div>
    );
}

Verktoylinje.propTypes = {
    viserHistoriskPeriode: PT.bool.isRequired,
    privatModus: PT.bool.isRequired,
    erVeileder: PT.bool.isRequired,
    harTilgangTilAktiviteter: PT.bool.isRequired,
    harSkriveTilgang: PT.bool.isRequired,
    erPrivatBruker: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    viserHistoriskPeriode: selectViserHistoriskPeriode(state),
    privatModus: selectErPrivatModus(state),
    erPrivatBruker: erPrivateBrukerSomSkalSkrusAv(state), // todo remove me
    harTilgangTilAktiviteter: selectHarTilgangTilAktiviteter(state),
    erVeileder: selectErVeileder(state),
    harSkriveTilgang: selectHarSkriveTilgang(state),
});

export default connect(mapStateToProps)(Verktoylinje);
