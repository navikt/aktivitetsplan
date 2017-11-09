import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Lenkeknapp from '../../felles-komponenter/utils/lenkeknapp';
import Filter from '../filtrering/filter';
import PeriodeFilter from '../filtrering/filter/periode-filter';
import { selectErPrivatModus } from '../privat-modus/privat-modus-selector';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectErVeileder } from '../identitet/identitet-selector';
import { selectHarTilgangTilAktiviteter } from '../aktivitet/aktivitet-selector';

function Verktoylinje({
    viserHistoriskPeriode,
    harTilgangTilAktiviteter,
    privatModus,
    erVeileder,
}) {
    return (
        <div className="verktoylinje">
            <div className="verktoylinje__verktoy">
                <Lenkeknapp
                    type="hoved"
                    href="/aktivitet/ny"
                    disabled={
                        viserHistoriskPeriode ||
                        privatModus ||
                        !harTilgangTilAktiviteter
                    }
                >
                    <FormattedMessage id="nyaktivitetsknapp" />
                </Lenkeknapp>
            </div>
            <div className="verktoylinje__verktoy-container">
                <PeriodeFilter
                    className="verktoylinje__verktoy"
                    skjulInneverende={privatModus && erVeileder}
                />
                <Filter
                    className="verktoylinje__verktoy"
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
};

const mapStateToProps = state => ({
    viserHistoriskPeriode: selectViserHistoriskPeriode(state),
    privatModus: selectErPrivatModus(state),
    harTilgangTilAktiviteter: selectHarTilgangTilAktiviteter(state),
    erVeileder: selectErVeileder(state),
});

export default connect(mapStateToProps)(Verktoylinje);
