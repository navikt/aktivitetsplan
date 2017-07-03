import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { Checkbox, Radio } from 'nav-frontend-skjema';
import { groupBy, identity } from 'lodash';
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

function pluckUnique(collection, propertyName) {
    return Object.keys(groupBy(collection, propertyName)).filter(
        key => key !== 'null'
    );
}

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
            {aktivitetTyper.map(aktivitetType => (
                <Checkbox
                    label={
                        <FormattedMessage
                            id={`aktivitet.type.${aktivitetType}`.toLowerCase()}
                        />
                    }
                    onChange={() => doToggleAktivitetsType(aktivitetType)}
                    checked={aktivitetTyper[aktivitetType]}
                />
            ))}
        </VisibleIfDiv>
    );
}

TypeFilter.propTypes = {
    harAktivitetTyper: PT.bool.isRequired,
    aktivitetTyper: PT.arrayOf(PT.string).isRequired,
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
            {aktivitetEtiketter.map(aktivitetEtikett => (
                <Checkbox
                    label={
                        <FormattedMessage id={`etikett.${aktivitetEtikett}`} />
                    }
                    onChange={() => doToggleAktivitetsEtikett(aktivitetEtikett)}
                    checked={aktivitetEtiketter[aktivitetEtikett]}
                />
            ))}
        </VisibleIfDiv>
    );
}

EtikettFilter.propTypes = {
    harAktivitetEtiketter: PT.bool.isRequired,
    aktivitetEtiketter: PT.arrayOf(PT.string).isRequired,
    doToggleAktivitetsEtikett: PT.func.isRequired,
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
                    <Radio
                        label={
                            <div>
                                <Dato>{t.fra}</Dato>
                                <span> - </span>
                                <Dato>{t.til}</Dato>
                            </div>
                        }
                        name={id}
                        onChange={() => doVelgHistoriskPeriode(t)}
                        checked={
                            !!historiskPeriode && historiskPeriode.id === id
                        }
                    />
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
    aktiviteterReducer,
    arenaAktiviteterReducer,
    situasjonReducer,
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
                {tittel => (
                    <Dropdown name={tittel}>
                        <Innholdslaster
                            avhengigheter={[
                                aktiviteterReducer,
                                arenaAktiviteterReducer,
                                situasjonReducer,
                            ]}
                        >
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
                    </Dropdown>
                )}
            </FormattedMessage>
        </VisibleIfDiv>
    );
}

Filter.defaultProps = {
    historiskPeriode: null,
};

Filter.propTypes = {
    aktiviteterReducer: AppPT.reducer.isRequired,
    arenaAktiviteterReducer: AppPT.reducer.isRequired,
    situasjonReducer: AppPT.reducer.isRequired,
    harAktivitetTyper: PT.bool.isRequired,
    aktivitetTyper: PT.arrayOf(PT.string).isRequired,
    harAktivitetEtiketter: PT.bool.isRequired,
    aktivitetEtiketter: PT.arrayOf(PT.string).isRequired,
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
    const stateData = state.data;
    const aktiviteterReducer = stateData.aktiviteter;
    const situasjonReducer = stateData.situasjon;
    const arenaAktiviteterReducer = stateData.arenaAktiviteter;
    const aktiviteter = aktiviteterReducer.data.concat(
        arenaAktiviteterReducer.data
    );

    const oppfolgingsPerioder = situasjonReducer.data.oppfolgingsPerioder || [];
    let fraGrense = '';
    const historiskePerioder = oppfolgingsPerioder
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

    const aktivitetTyper = pluckUnique(aktiviteter, 'type');
    const aktivitetEtiketter = pluckUnique(aktiviteter, 'etikett', identity);
    return {
        aktiviteterReducer,
        arenaAktiviteterReducer,
        situasjonReducer,
        historiskePerioder,
        historiskPeriode: stateData.filter.historiskPeriode,
        harHistoriskePerioder: historiskePerioder.length > 0,
        aktivitetTyper,
        harAktivitetTyper: aktivitetTyper.length > 1,
        aktivitetEtiketter,
        harAktivitetEtiketter: aktivitetEtiketter.length > 1,
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
