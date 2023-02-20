import classNames from 'classnames';
import { Radio } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Dato from '../../../felles-komponenter/Dato';
import Dropdown from '../../../felles-komponenter/dropdown/dropdown';
import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';
import loggEvent, { LIST_HISTORISK_PERIODE, VIS_HISTORISK_PERIODE } from '../../../felles-komponenter/utils/logging';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import * as AppPT from '../../../proptypes';
import { selectSorterteHistoriskeOppfolgingsPerioder } from '../../oppfolging-status/oppfolging-selector';
import { velgHistoriskPeriode } from './filter-reducer';
import { selectHistoriskPeriode } from './filter-selector';

export function PeriodeLabel({ historiskPeriode }) {
    return (
        <div>
            <Dato>{historiskPeriode.vistFra}</Dato>
            <span> - </span>
            <Dato>{historiskPeriode.til}</Dato>
        </div>
    );
}

PeriodeLabel.defaultProps = {
    historiskPeriode: null,
};

PeriodeLabel.propTypes = {
    historiskPeriode: AppPT.oppfolgingsPeriode,
};

const periodeFilterCls = (classes) => classNames(classes);

function PeriodeFilter({
    harHistoriskePerioder,
    historiskPeriode,
    historiskePerioder,
    doVelgHistoriskPeriode,
    className,
    skjulInneverende,
}) {
    return (
        <VisibleIfDiv className={periodeFilterCls(className)} visible={harHistoriskePerioder}>
            <Dropdown
                name="periode-filter"
                knappeTekst="Tidligere planer"
                onOpen={() => loggEvent(LIST_HISTORISK_PERIODE)}
            >
                <div className="filter__container">
                    <div className="filter space-y-4 pb-4">
                        <Undertittel className="filter__tittel">Velg periode</Undertittel>
                        <HiddenIfDiv hidden={skjulInneverende}>
                            <Radio
                                className="filter__radio--periode"
                                label="Nåværende periode"
                                name="inneverende"
                                onChange={() => doVelgHistoriskPeriode(null)}
                                checked={!historiskPeriode}
                            />
                        </HiddenIfDiv>
                        {historiskePerioder.map((t) => {
                            const { id } = t;
                            return (
                                <div key={id}>
                                    <Radio
                                        className="filter__radio--periode"
                                        label={<PeriodeLabel historiskPeriode={t} />}
                                        name={id}
                                        onChange={() => {
                                            doVelgHistoriskPeriode(t);
                                            loggEvent(VIS_HISTORISK_PERIODE);
                                        }}
                                        checked={!!historiskPeriode && historiskPeriode.id === id}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Dropdown>
        </VisibleIfDiv>
    );
}

PeriodeFilter.propTypes = {
    harHistoriskePerioder: PT.bool.isRequired,
    historiskePerioder: PT.arrayOf(AppPT.oppfolgingsPeriode).isRequired,
    historiskPeriode: AppPT.oppfolgingsPeriode,
    doVelgHistoriskPeriode: PT.func.isRequired,
    className: PT.string,
    skjulInneverende: PT.bool.isRequired,
};

PeriodeFilter.defaultProps = {
    historiskPeriode: null,
    className: '',
};

const mapStateToProps = (state) => {
    const historiskePerioder = selectSorterteHistoriskeOppfolgingsPerioder(state);
    return {
        historiskePerioder,
        historiskPeriode: selectHistoriskPeriode(state),
        harHistoriskePerioder: historiskePerioder.length > 0,
    };
};

const mapDispatchToProps = (dispatch) => ({
    doVelgHistoriskPeriode: (aktivitetsType) => dispatch(velgHistoriskPeriode(aktivitetsType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PeriodeFilter);
