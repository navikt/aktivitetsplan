import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { Radio } from 'nav-frontend-skjema';
import PT from 'prop-types';
import Dato from '../../felles-komponenter/dato';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import * as AppPT from '../../proptypes';

function PeriodeLabel({ historiskPeriode }) {
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

export default PeriodeFilter;
