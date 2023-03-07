import { Select } from '@navikt/ds-react';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { ChangeEventHandler, useRef, useState } from 'react';
import { connect } from 'react-redux';

import { HistoriskOppfolgingsPeriode, OppfolgingsPeriode } from '../../../datatypes/oppfolgingTypes';
import Dato from '../../../felles-komponenter/Dato';
import { useOutsideClick } from '../../../felles-komponenter/hooks/useClickOutside';
import { ReduxDispatch } from '../../../felles-komponenter/hooks/useReduxDispatch';
import loggEvent, { LIST_HISTORISK_PERIODE, VIS_HISTORISK_PERIODE } from '../../../felles-komponenter/utils/logging';
import * as AppPT from '../../../proptypes';
import {
    VistOppfolgingsPeriode,
    selectSorterteHistoriskeOppfolgingsPerioder,
} from '../../oppfolging-status/oppfolging-selector';
import { velgHistoriskPeriode } from './filter-reducer';
import { selectHistoriskPeriode } from './filter-selector';

export function PeriodeLabel({ historiskPeriode }: { historiskPeriode: VistOppfolgingsPeriode }) {
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

interface Props {
    harHistoriskePerioder: boolean;
    historiskePerioder: VistOppfolgingsPeriode[];
    historiskPeriode?: OppfolgingsPeriode;
    doVelgHistoriskPeriode: (periode: null | HistoriskOppfolgingsPeriode) => void;
    skjulInneverende: boolean;
}

const PeriodeFilter = ({
    harHistoriskePerioder,
    historiskPeriode,
    historiskePerioder,
    doVelgHistoriskPeriode,
    skjulInneverende,
}: Props) => {
    const [open, setOpen] = useState(false);

    const ref = useRef(null);
    useOutsideClick(ref, () => setOpen(!open), open);

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
        // <div ref={ref} className="flex items-start">
        <div ref={ref} className="flex items-start">
            <Select
                className="w-full sm:w-60"
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
                {historiskePerioder.map((oppfolgingsPeriode, index) => {
                    return (
                        <option value={oppfolgingsPeriode.uuid} key={index}>
                            {`${format(new Date(oppfolgingsPeriode.fra), 'dd/yyyy')} - ${format(
                                new Date(oppfolgingsPeriode.til),
                                'dd/yyyy'
                            )}`}
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
    doVelgHistoriskPeriode: (aktivitetsType: null | HistoriskOppfolgingsPeriode) =>
        dispatch(velgHistoriskPeriode(aktivitetsType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PeriodeFilter);
