import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { Checkbox, Radio } from 'nav-frontend-skjema';
import {
    toggleAktivitetsType,
    toggleAktivitetsEtikett,
    velgHistoriskPeriode,
} from './filter-reducer';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import Dato from '../../felles-komponenter/dato';
import Dropdown from '../../felles-komponenter/dropdown/dropdown';
import {
    selectAktivitetListeReducer,
    selectAlleAktiviter,
} from '../aktivitet/aktivitetliste-selector';
import {
    selectOppfolgingsPerioder,
    selectSituasjonReducer,
} from '../situasjon/situasjon-selector';
import {
    selectAktivitetEtiketterFilter,
    selectAktivitetTyperFilter,
    selectHistoriskPeriode,
} from './filter-selector';

function TypeFilter({
    harAktivitetTyper,
    aktivitetTyper,
    doToggleAktivitetsType,
}) {
    return (
        <VisibleIfDiv visible={harAktivitetTyper}>
            <Undertittel>
                <FormattedMessage id="filter.aktivitet.type.tittel" />
            </Undertittel>
            {Object.keys(aktivitetTyper).map(aktivitetType =>
                <Checkbox
                    key={aktivitetType}
                    label={
                        <FormattedMessage
                            id={`aktivitet.type.${aktivitetType}`.toLowerCase()}
                        />
                    }
                    onChange={() => doToggleAktivitetsType(aktivitetType)}
                    checked={aktivitetTyper[aktivitetType]}
                />
            )}
        </VisibleIfDiv>
    );
}

TypeFilter.propTypes = {
    harAktivitetTyper: PT.bool.isRequired,
    aktivitetTyper: PT.object.isRequired,
    doToggleAktivitetsType: PT.func.isRequired,
};

function EtikettFilter({
    harAktivitetEtiketter,
    aktivitetEtiketter,
    doToggleAktivitetsEtikett,
}) {
    return (
        <VisibleIfDiv visible={harAktivitetEtiketter}>
            <Undertittel>
                <FormattedMessage id="filter.aktivitet.etikett.tittel" />
            </Undertittel>
            {Object.keys(aktivitetEtiketter).map(aktivitetEtikett =>
                <Checkbox
                    key={aktivitetEtikett}
                    label={
                        <FormattedMessage id={`etikett.${aktivitetEtikett}`} />
                    }
                    onChange={() => doToggleAktivitetsEtikett(aktivitetEtikett)}
                    checked={aktivitetEtiketter[aktivitetEtikett]}
                />
            )}
        </VisibleIfDiv>
    );
}

EtikettFilter.propTypes = {
    harAktivitetEtiketter: PT.bool.isRequired,
    aktivitetEtiketter: PT.object.isRequired,
    doToggleAktivitetsEtikett: PT.func.isRequired,
};

function PeriodeLabel({ historiskPeriode }) {
    return (
        <div>
            <Dato>
                {historiskPeriode.fra}
            </Dato>
            <span> - </span>
            <Dato>
                {historiskPeriode.til}
            </Dato>
        </div>
    );
}

PeriodeLabel.propTypes = {
    historiskPeriode: AppPT.oppfolgingsPeriode.isRequired,
};

function PeriodeFilter({
    harHistoriskePerioder,
    historiskPeriode,
    historiskePerioder,
    doVelgHistoriskPeriode,
}) {
    return (
        <VisibleIfDiv visible={harHistoriskePerioder}>
            <Undertittel>
                <FormattedMessage id="filter.periode.tittel" />
            </Undertittel>
            <Radio
                label={<FormattedMessage id="filter.periode.inneverende" />}
                name="inneverende"
                onChange={() => doVelgHistoriskPeriode(null)}
                checked={!historiskPeriode}
            />
            {historiskePerioder.map(t => {
                const id = t.id;
                return (
                    <div key={id}>
                        <Radio
                            label={<PeriodeLabel historiskPeriode={t} />}
                            name={id}
                            onChange={() => doVelgHistoriskPeriode(t)}
                            checked={
                                !!historiskPeriode && historiskPeriode.id === id
                            }
                        />
                    </div>
                );
            })}
        </VisibleIfDiv>
    );
}

PeriodeFilter.propTypes = {
    harHistoriskePerioder: PT.bool.isRequired,
    historiskePerioder: PT.arrayOf(AppPT.oppfolgingsPeriode).isRequired,
    historiskPeriode: AppPT.oppfolgingsPeriode,
    doVelgHistoriskPeriode: PT.func.isRequired,
};

PeriodeFilter.defaultProps = {
    historiskPeriode: null,
};

function Filter({
    avhengigheter,
    harAktivitetTyper,
    aktivitetTyper,
    harAktivitetEtiketter,
    aktivitetEtiketter,
    harHistoriskePerioder,
    historiskePerioder,
    historiskPeriode,
    doToggleAktivitetsType,
    doToggleAktivitetsEtikett,
    doVelgHistoriskPeriode,
}) {
    return (
        <VisibleIfDiv
            className="filter"
            visible={
                harAktivitetEtiketter ||
                harHistoriskePerioder ||
                harAktivitetTyper
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
    doToggleAktivitetsType: PT.func.isRequired,
    doToggleAktivitetsEtikett: PT.func.isRequired,
    doVelgHistoriskPeriode: PT.func.isRequired,
};

function tidligsteHendelsesTidspunktMellom(fra, til, state) {
    const stateData = state.data;
    const tidspunkter = stateData.aktiviteter.data
        .map(a => a.opprettetDato)
        .concat(stateData.dialog.data.map(d => d.opprettetDato));
    return tidspunkter.filter(t => t > fra && t < til).sort()[0] || til;
}

const mapStateToProps = state => {
    const aktiviteter = selectAlleAktiviter(state);

    let fraGrense = '';
    const historiskePerioder = selectOppfolgingsPerioder(state)
        .map(p => p.sluttDato)
        .sort()
        .map(sluttDato => {
            const fra = tidligsteHendelsesTidspunktMellom(
                fraGrense,
                sluttDato,
                state
            );
            fraGrense = sluttDato;
            return {
                id: sluttDato,
                til: sluttDato,
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
    };
};

const mapDispatchToProps = dispatch => ({
    doToggleAktivitetsType: aktivitetsType =>
        dispatch(toggleAktivitetsType(aktivitetsType)),
    doToggleAktivitetsEtikett: aktivitetsType =>
        dispatch(toggleAktivitetsEtikett(aktivitetsType)),
    doVelgHistoriskPeriode: aktivitetsType =>
        dispatch(velgHistoriskPeriode(aktivitetsType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
