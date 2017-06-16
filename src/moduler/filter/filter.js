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

function Filter({
    aktiviteterReducer,
    arenaAktiviteterReducer,
    oppfolgingStatusReducer,
    aktivitetTyper,
    aktivitetEtiketter,
    historiskePerioder,
    historiskPeriode,
    doToggleAktivitetsType,
    doToggleAktivitetsEtikett,
    doVelgHistoriskPeriode,
}) {
    return (
        <div className="filter">
            <Dropdown name={<FormattedMessage id="filter.tittel" />}>
                <Innholdslaster
                    avhengigheter={[
                        aktiviteterReducer,
                        arenaAktiviteterReducer,
                        oppfolgingStatusReducer,
                    ]}
                >
                    <div className="filter__container">
                        <VisibleIfDiv visible={aktivitetTyper.length > 1}>
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
                                    onChange={() =>
                                        doToggleAktivitetsType(aktivitetType)}
                                    checked={aktivitetTyper[aktivitetType]}
                                />
                            ))}
                        </VisibleIfDiv>
                        <VisibleIfDiv visible={aktivitetEtiketter.length > 1}>
                            <Undertittel>
                                <FormattedMessage id="filter.aktivitet.etikett.tittel" />
                            </Undertittel>
                            {aktivitetEtiketter.map(aktivitetEtikett => (
                                <Checkbox
                                    label={
                                        <FormattedMessage
                                            id={`etikett.${aktivitetEtikett}`}
                                        />
                                    }
                                    onChange={() =>
                                        doToggleAktivitetsEtikett(
                                            aktivitetEtikett
                                        )}
                                    checked={
                                        aktivitetEtiketter[aktivitetEtikett]
                                    }
                                />
                            ))}
                        </VisibleIfDiv>
                        <VisibleIfDiv visible={historiskePerioder.length > 0}>
                            <Undertittel>
                                <FormattedMessage id="filter.periode.tittel" />
                            </Undertittel>
                            <Radio
                                label={
                                    <FormattedMessage id="filter.periode.inneverende" />
                                }
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
                                        onChange={() =>
                                            doVelgHistoriskPeriode(t)}
                                        checked={
                                            !!historiskPeriode &&
                                                historiskPeriode.id === id
                                        }
                                    />
                                );
                            })}
                        </VisibleIfDiv>
                    </div>
                </Innholdslaster>
            </Dropdown>
        </div>
    );
}

Filter.defaultProps = {
    historiskPeriode: null,
};

Filter.propTypes = {
    aktiviteterReducer: AppPT.reducer.isRequired,
    arenaAktiviteterReducer: AppPT.reducer.isRequired,
    oppfolgingStatusReducer: AppPT.reducer.isRequired,
    aktivitetTyper: PT.arrayOf(PT.string).isRequired,
    aktivitetEtiketter: PT.arrayOf(PT.string).isRequired,
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
    return tidspunkter.filter(t => t > fra && t < til).sort()[0];
}

const mapStateToProps = state => {
    const stateData = state.data;
    const aktiviteterReducer = stateData.aktiviteter;
    const oppfolgingStatusReducer = stateData.oppfolgingStatus;
    const arenaAktiviteterReducer = stateData.arenaAktiviteter;
    const aktiviteter = aktiviteterReducer.data.concat(
        arenaAktiviteterReducer.data
    );

    const oppfolgingsPerioder = oppfolgingStatusReducer.data
        .oppfolgingsPerioder || [];
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

    return {
        aktiviteterReducer,
        arenaAktiviteterReducer,
        oppfolgingStatusReducer,
        historiskePerioder,
        historiskPeriode: stateData.filter.historiskPeriode,
        aktivitetTyper: pluckUnique(aktiviteter, 'type'),
        aktivitetEtiketter: pluckUnique(aktiviteter, 'etikett', identity),
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
