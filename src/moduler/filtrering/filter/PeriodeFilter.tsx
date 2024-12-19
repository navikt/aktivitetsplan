import { Select } from '@navikt/ds-react';
import { format } from 'date-fns';
import React, { ChangeEventHandler, useEffect } from 'react';
import { useSelector } from 'react-redux';

import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import { selectSorterteOppfolgingsperioder } from '../../oppfolging-status/oppfolging-selector';
import { velgPeriode } from './valgt-periode-slice';

const PeriodeFilter = () => {
    const perioder = useSelector(selectSorterteOppfolgingsperioder);
    const historiskePerioder = perioder.filter((periode) => !!periode.slutt);
    const harHistoriskePerioder = historiskePerioder.length > 0;

    const dispatch = useAppDispatch();

    const nyestePeriode = perioder.length > 0 ? perioder[0] : null;

    useEffect(() => {
        if (!!nyestePeriode) {
            dispatch(velgPeriode(nyestePeriode.id));
        }
    }, [perioder]);

    if (!harHistoriskePerioder) return null;
    // 0 periode? - ikke vis dropdown - har ikke hist
    // Kun 1 aktiv periode - IKKE vis dropdown -- har ikke hist
    // Kun 1 historisk periode - vis dropdown
    // Alt annet - vis dropdown

    const onPeriodeChange: ChangeEventHandler<HTMLSelectElement> = (val) => {
        const selectedPeriodeId = val.target.value;
        dispatch(velgPeriode(selectedPeriodeId));
    };

    return (
        <div className="flex items-start">
            <Select
                className="w-full sm:w-64"
                hideLabel
                autoComplete="on"
                defaultValue={nyestePeriode?.id}
                label="Periode"
                onChange={onPeriodeChange}
            >
                {perioder.map(({ start, slutt, id }) => {
                    const fraDato = format(new Date(start), 'dd. MMM yyyy');
                    const navn =
                        slutt === undefined || slutt === null
                            ? 'Nåværende periode'
                            : `${fraDato} - ${format(new Date(slutt), 'dd. MMM yyyy')}`;
                    return (
                        <option value={id} key={id}>
                            {navn}
                        </option>
                    );
                })}
            </Select>
        </div>
    );
};

export default PeriodeFilter;
