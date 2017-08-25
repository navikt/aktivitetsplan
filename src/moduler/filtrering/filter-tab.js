import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import * as AppPT from '../../proptypes';
import {
    toggleAktivitetsEtikett,
    toggleAktivitetsStatus,
    toggleAktivitetsType,
    velgHistoriskPeriode,
} from './filter/filter-reducer';
import FiltreringLabel from './filteringslabel/filtering-label';
import { PeriodeLabel } from './filter/periode-filter';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import {
    selectAktivitetEtiketterFilter,
    selectAktivitetStatusFilter,
    selectAktivitetTyperFilter,
    selectHistoriskPeriode,
} from './filter/filter-selector';

function FilterTab({
    aktivitetStatusFilter,
    aktivitetEtiketter,
    aktivitetTyper,
    historiskPeriode,
    doToggleAktivitetsEtikett,
    doToggleAktivitetsType,
    doToggleAktivitetsStatus,
    doVelgHistoriskPeriode,
}) {
    return (
        <div className="filtrering-label-container">
            {Object.keys(aktivitetTyper)
                .filter(aktivitetType => aktivitetTyper[aktivitetType])
                .map(aktivitetType =>
                    <FiltreringLabel
                        key={aktivitetType}
                        label={
                            <FormattedMessage
                                id={`aktivitet.type.${aktivitetType}`.toLowerCase()}
                            />
                        }
                        slettFilter={() =>
                            doToggleAktivitetsType(aktivitetType)}
                    />
                )}

            {Object.keys(aktivitetEtiketter)
                .filter(
                    aktivitetsEtikett => aktivitetEtiketter[aktivitetsEtikett]
                )
                .map(aktivitetsEtikett =>
                    <FiltreringLabel
                        key={aktivitetsEtikett}
                        label={
                            <FormattedMessage
                                id={`etikett.${aktivitetsEtikett}`}
                            />
                        }
                        slettFilter={() =>
                            doToggleAktivitetsEtikett(aktivitetsEtikett)}
                    />
                )}

            {Object.keys(aktivitetStatusFilter)
                .filter(
                    aktivitetsStatus => aktivitetStatusFilter[aktivitetsStatus]
                )
                .map(aktivitetsStatus =>
                    <FiltreringLabel
                        key={aktivitetsStatus}
                        label={
                            <FormattedMessage
                                id={`aktivitet.status.${aktivitetsStatus}`.toLowerCase()}
                            />
                        }
                        slettFilter={() =>
                            doToggleAktivitetsStatus(aktivitetsStatus)}
                    />
                )}
            <VisibleIfDiv visible={!!historiskPeriode}>
                <FiltreringLabel
                    key={historiskPeriode}
                    label={<PeriodeLabel historiskPeriode={historiskPeriode} />}
                    slettFilter={() => doVelgHistoriskPeriode(null)}
                />
            </VisibleIfDiv>
        </div>
    );
}

FilterTab.defaultProps = {
    aktivitetStatusFilter: {},
    historiskPeriode: null,
    aktivitetTyper: {},
    aktivitetEtiketter: {},
};

FilterTab.propTypes = {
    aktivitetStatusFilter: PT.object,
    aktivitetEtiketter: PT.object,
    aktivitetTyper: PT.object,
    historiskPeriode: AppPT.oppfolgingsPeriode,
    doToggleAktivitetsEtikett: PT.func.isRequired,
    doToggleAktivitetsStatus: PT.func.isRequired,
    doToggleAktivitetsType: PT.func.isRequired,
    doVelgHistoriskPeriode: PT.func.isRequired,
};

const mapStateToProps = state => ({
    aktivitetStatusFilter: selectAktivitetStatusFilter(state),
    aktivitetEtiketter: selectAktivitetEtiketterFilter(state),
    aktivitetTyper: selectAktivitetTyperFilter(state),
    historiskPeriode: selectHistoriskPeriode(state),
});

const mapDispatchToProps = dispatch => ({
    doToggleAktivitetsEtikett: aktivitetsEtikett =>
        dispatch(toggleAktivitetsEtikett(aktivitetsEtikett)),
    doToggleAktivitetsStatus: aktivitetsStatus =>
        dispatch(toggleAktivitetsStatus(aktivitetsStatus)),
    doToggleAktivitetsType: aktivitetsType =>
        dispatch(toggleAktivitetsType(aktivitetsType)),
    doVelgHistoriskPeriode: historiskPeriode =>
        dispatch(velgHistoriskPeriode(historiskPeriode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterTab);
