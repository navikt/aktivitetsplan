import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { Radio } from 'nav-frontend-skjema';
import PT from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Dato from '../../../felles-komponenter/dato';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import * as AppPT from '../../../proptypes';
import { selectHistoriskPeriode } from './filter-selector';
import { selectHistoriskeOppfolgingsPerioder } from '../../situasjon/situasjon-selector';
import { selectAlleHistoriskeVilkar } from '../../vilkar/historiske-vilkar-selector';
import { velgHistoriskPeriode } from './filter-reducer';
import Dropdown from '../../../felles-komponenter/dropdown/dropdown';

export function PeriodeLabel({ historiskPeriode }) {
    return (
        <div>
            <Dato>
                {historiskPeriode.vistFra}
            </Dato>
            <span> - </span>
            <Dato>
                {historiskPeriode.til}
            </Dato>
        </div>
    );
}

PeriodeLabel.defaultProps = {
    historiskPeriode: null,
};

PeriodeLabel.propTypes = {
    historiskPeriode: AppPT.oppfolgingsPeriode,
};

const periodeFilterCls = classes => classNames(classes);

function PeriodeFilter({
    harHistoriskePerioder,
    historiskPeriode,
    historiskePerioder,
    doVelgHistoriskPeriode,
    className,
}) {
    return (
        <VisibleIfDiv
            className={periodeFilterCls(className)}
            visible={harHistoriskePerioder}
        >
            <FormattedMessage id="periode-filter.tittel">
                {tittel =>
                    <Dropdown name="periode-filter" knappeTekst={tittel}>
                        <div className="filter__container">
                            <div className="filter">
                                <Undertittel className="filter__tittel">
                                    <FormattedMessage id="filter.periode.tittel" />
                                </Undertittel>
                                <Radio
                                    className="filter__radio--periode"
                                    label={
                                        <FormattedMessage id="filter.periode.inneverende" />
                                    }
                                    name="inneverende"
                                    onChange={() =>
                                        doVelgHistoriskPeriode(null)}
                                    checked={!historiskPeriode}
                                />
                                {historiskePerioder.map(t => {
                                    const id = t.id;
                                    return (
                                        <div key={id}>
                                            <Radio
                                                className="filter__radio--periode"
                                                label={
                                                    <PeriodeLabel
                                                        historiskPeriode={t}
                                                    />
                                                }
                                                name={id}
                                                onChange={() =>
                                                    doVelgHistoriskPeriode(t)}
                                                checked={
                                                    !!historiskPeriode &&
                                                    historiskPeriode.id === id
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Dropdown>}
            </FormattedMessage>
        </VisibleIfDiv>
    );
}

PeriodeFilter.propTypes = {
    harHistoriskePerioder: PT.bool.isRequired,
    historiskePerioder: PT.arrayOf(AppPT.oppfolgingsPeriode).isRequired,
    historiskPeriode: AppPT.oppfolgingsPeriode,
    doVelgHistoriskPeriode: PT.func.isRequired,
    className: PT.string,
};

PeriodeFilter.defaultProps = {
    historiskPeriode: null,
    className: '',
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
    return {
        historiskePerioder,
        historiskPeriode: selectHistoriskPeriode(state),
        harHistoriskePerioder: historiskePerioder.length > 0,
    };
};

const mapDispatchToProps = dispatch => ({
    doVelgHistoriskPeriode: aktivitetsType =>
        dispatch(velgHistoriskPeriode(aktivitetsType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PeriodeFilter);
