import { Select } from '@navikt/ds-react';
import { format } from 'date-fns';
import React, { ChangeEventHandler } from 'react';
import { connect } from 'react-redux';

import { HistoriskOppfolgingsperiode, Oppfolgingsperiode } from '../../../datatypes/oppfolgingTypes';
import { ReduxDispatch } from '../../../felles-komponenter/hooks/useReduxDispatch';
import loggEvent, { VIS_HISTORISK_PERIODE } from '../../../felles-komponenter/utils/logging';
import {
    VistOppfolgingsPeriode,
    selectSorterteHistoriskeOppfolgingsPerioder,
} from '../../oppfolging-status/oppfolging-selector';
import { velgHistoriskPeriode } from './filter-reducer';
import { selectHistoriskPeriode } from './filter-selector';

interface Props {
    harHistoriskePerioder: boolean;
    historiskePerioder: VistOppfolgingsPeriode[];
    historiskPeriode?: Oppfolgingsperiode;
    doVelgHistoriskPeriode: (periode: null | HistoriskOppfolgingsperiode) => void;
    skjulInneverende: boolean;
}

const PeriodeFilter = ({
    harHistoriskePerioder,
    historiskPeriode,
    historiskePerioder,
    doVelgHistoriskPeriode,
    skjulInneverende,
}: Props) => {
    if (!harHistoriskePerioder) return null;

    const onPeriodeChange: ChangeEventHandler<HTMLSelectElement> = (val) => {
        const selectedPeriodeId = val.target.value;
        if (selectedPeriodeId === 'inneverende') doVelgHistoriskPeriode(null);
        else {
            const periode = historiskePerioder.find((periode) => periode.uuid === selectedPeriodeId);
            if (!periode) return;
            loggEvent(VIS_HISTORISK_PERIODE);
            doVelgHistoriskPeriode(periode);
        }
    };

    return (
        <div className="flex items-start">
            <Select
                className="w-full sm:w-64"
                hideLabel
                defaultValue={!historiskPeriode ? 'inneverende' : historiskPeriode.uuid}
                label="Periode"
                onChange={onPeriodeChange}
            >
                {skjulInneverende ? null : (
                    <option value="inneverende" className="filter__radio--periode">
                        Nåværende periode
                    </option>
                )}
                {historiskePerioder.map((oppfolgingsperiode, index) => {
                    const fraDato = format(new Date(oppfolgingsperiode.startDato), 'dd. MMM yyyy');
                    const tilDato = format(new Date(oppfolgingsperiode.sluttDato), 'dd. MMM yyyy');
                    return (
                        <option value={oppfolgingsperiode.uuid} key={index}>
                            {`${fraDato} - ${tilDato}`}
                        </option>
                    );
                })}
            </Select>
        </div>
    );
};

(PeriodeFilter as any).defaultProps = {
    historiskPeriode: null,
};

const mapStateToProps = (state: any) => {
    const historiskePerioder = selectSorterteHistoriskeOppfolgingsPerioder(state);
    return {
        historiskePerioder,
        historiskPeriode: selectHistoriskPeriode(state),
        harHistoriskePerioder: historiskePerioder.length > 0,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    doVelgHistoriskPeriode: (historiskOppfolgingsperiode: null | HistoriskOppfolgingsperiode) =>
        dispatch(velgHistoriskPeriode(historiskOppfolgingsperiode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PeriodeFilter);
