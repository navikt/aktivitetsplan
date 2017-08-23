import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
    toggleAktivitetsType,
    toggleAktivitetsEtikett,
    toggleAktivitetsStatus,
    velgHistoriskPeriode,
} from './filter-reducer';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import Dropdown from '../../felles-komponenter/dropdown/dropdown';
import {
    selectAktivitetListeReducer,
    selectAlleAktiviter,
} from '../aktivitet/aktivitetliste-selector';
import {
    selectHistoriskeOppfolgingsPerioder,
    selectSituasjonReducer,
} from '../situasjon/situasjon-selector';
import {
    selectAktivitetEtiketterFilter,
    selectAktivitetTyperFilter,
    selectHistoriskPeriode,
    selectAktivitetStatusFilter,
} from './filter-selector';
import { selectAlleHistoriskeVilkar } from '../vilkar/historiske-vilkar-selector';
import PeriodeFilter from './periode-filter';
import TypeFilter from './type-filter';
import EtikettFilter from './etikett-filter';
import StatusFilter from './status-filter';

function Filter({
    avhengigheter,
    harAktivitetTyper,
    aktivitetTyper,
    harAktivitetEtiketter,
    aktivitetEtiketter,
    harHistoriskePerioder,
    historiskePerioder,
    historiskPeriode,
    aktivitetStatus,
    harAktivitetStatus,
    doToggleAktivitetsType,
    doToggleAktivitetsEtikett,
    doVelgHistoriskPeriode,
    doToggleAktivitetsStatus,
}) {
    return (
        <VisibleIfDiv
            className="filter"
            visible={
                harAktivitetEtiketter ||
                harHistoriskePerioder ||
                harAktivitetTyper ||
                harAktivitetStatus
            }
        >
            <FormattedMessage id="filter.tittel">
                {tittel =>
                    <Dropdown name={tittel}>
                        <Innholdslaster avhengigheter={avhengigheter}>
                            <div className="filter__container">
                                <TypeFilter
                                    harAktivitetTyper={harAktivitetTyper}
                                    aktivitetTyper={aktivitetTyper}
                                    doToggleAktivitetsType={
                                        doToggleAktivitetsType
                                    }
                                />
                                <StatusFilter
                                    aktivitetStatus={aktivitetStatus}
                                    harAktivitetStatus={harAktivitetStatus}
                                    doToggleAktivitetsStatus={
                                        doToggleAktivitetsStatus
                                    }
                                />
                                <EtikettFilter
                                    harAktivitetEtiketter={
                                        harAktivitetEtiketter
                                    }
                                    aktivitetEtiketter={aktivitetEtiketter}
                                    doToggleAktivitetsEtikett={
                                        doToggleAktivitetsEtikett
                                    }
                                />
                                <PeriodeFilter
                                    harHistoriskePerioder={
                                        harHistoriskePerioder
                                    }
                                    historiskPeriode={historiskPeriode}
                                    historiskePerioder={historiskePerioder}
                                    doVelgHistoriskPeriode={
                                        doVelgHistoriskPeriode
                                    }
                                />
                            </div>
                        </Innholdslaster>
                    </Dropdown>}
            </FormattedMessage>
        </VisibleIfDiv>
    );
}

Filter.defaultProps = {
    historiskPeriode: null,
};

Filter.propTypes = {
    avhengigheter: PT.arrayOf(AppPT.reducer).isRequired,
    harAktivitetTyper: PT.bool.isRequired,
    aktivitetTyper: PT.object.isRequired,
    harAktivitetEtiketter: PT.bool.isRequired,
    aktivitetEtiketter: PT.object.isRequired,
    harHistoriskePerioder: PT.bool.isRequired,
    historiskePerioder: PT.arrayOf(AppPT.oppfolgingsPeriode).isRequired,
    historiskPeriode: AppPT.oppfolgingsPeriode,
    aktivitetStatus: PT.object.isRequired,
    harAktivitetStatus: PT.bool.isRequired,
    doToggleAktivitetsType: PT.func.isRequired,
    doToggleAktivitetsEtikett: PT.func.isRequired,
    doVelgHistoriskPeriode: PT.func.isRequired,
    doToggleAktivitetsStatus: PT.func.isRequired,
};

function tidligsteHendelsesTidspunktMellom(fra, til, state) {
    const stateData = state.data;
    const aktivitetDatoer = stateData.aktiviteter.data.map(
        a => a.opprettetDato
    );
    const dialogDatoer = stateData.dialog.data.map(d => d.opprettetDato);
    const vilkarDatoer = selectAlleHistoriskeVilkar(state).map(v => v.dato);
    const tidspunkter = [].concat(aktivitetDatoer, dialogDatoer, vilkarDatoer);
    return tidspunkter.filter(t => t > fra && t < til).sort()[0] || til;
}

const mapStateToProps = state => {
    const aktiviteter = selectAlleAktiviter(state);

    let fraGrense = '';
    const historiskePerioder = selectHistoriskeOppfolgingsPerioder(state)
        .sort((a, b) => a.sluttDato.localeCompare(b.sluttDato))
        .map(periode => {
            const fra = tidligsteHendelsesTidspunktMellom(
                fraGrense,
                periode.sluttDato,
                state
            );
            fraGrense = periode.sluttDato;
            return {
                id: periode.sluttDato,
                til: periode.sluttDato,
                vistFra: periode.startDato,
                fra,
            };
        })
        .reverse();
    const aktivitetTyperFilter = selectAktivitetTyperFilter(state);
    const aktivitetTyper = aktiviteter.reduce((typer, aktivitet) => {
        const type = aktivitet.type;
        typer[type] = aktivitetTyperFilter[type]; // eslint-disable-line no-param-reassign
        return typer;
    }, {});

    const aktivitetEtiketterFilter = selectAktivitetEtiketterFilter(state);
    const aktivitetEtiketter = aktiviteter.reduce((etiketter, aktivitet) => {
        const etikett = aktivitet.etikett;
        if (etikett) {
            etiketter[etikett] = aktivitetEtiketterFilter[etikett]; // eslint-disable-line no-param-reassign
        }
        return etiketter;
    }, {});

    const aktivitetStatusFilter = selectAktivitetStatusFilter(state);

    const aktivitetStatus = aktiviteter.reduce((statusliste, aktivitet) => {
        const status = aktivitet.status;
        statusliste[status] = aktivitetStatusFilter[status]; // eslint-disable-line no-param-reassign
        return statusliste;
    }, {});

    return {
        avhengigheter: [
            selectAktivitetListeReducer(state),
            selectSituasjonReducer(state),
        ],
        historiskePerioder,
        historiskPeriode: selectHistoriskPeriode(state),
        harHistoriskePerioder: historiskePerioder.length > 0,
        aktivitetTyper,
        harAktivitetTyper: Object.keys(aktivitetTyper).length > 1,
        aktivitetEtiketter,
        harAktivitetEtiketter: Object.keys(aktivitetEtiketter).length > 1,
        aktivitetStatus,
        harAktivitetStatus: Object.keys(aktivitetStatus).length > 1,
    };
};

const mapDispatchToProps = dispatch => ({
    doToggleAktivitetsType: aktivitetsType =>
        dispatch(toggleAktivitetsType(aktivitetsType)),
    doToggleAktivitetsEtikett: aktivitetsType =>
        dispatch(toggleAktivitetsEtikett(aktivitetsType)),
    doVelgHistoriskPeriode: aktivitetsType =>
        dispatch(velgHistoriskPeriode(aktivitetsType)),
    doToggleAktivitetsStatus: aktivitetsStatus =>
        dispatch(toggleAktivitetsStatus(aktivitetsStatus)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
