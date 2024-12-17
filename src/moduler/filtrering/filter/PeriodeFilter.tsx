import { Select } from '@navikt/ds-react';
import { format } from 'date-fns';
import React, { ChangeEventHandler, useEffect } from 'react';
import { useSelector } from 'react-redux';

import useAppDispatch from '../../../felles-komponenter/hooks/useAppDispatch';
import {
    selectErUnderOppfolging,
    selectSorterteOppfolgingsperioder,
} from '../../oppfolging-status/oppfolging-selector';
import { velgPeriode } from './valgt-periode-slice';

interface Props {}

const PeriodeFilter = () => {
    const erUnderOppfolging = useSelector(selectErUnderOppfolging);
    const skjulInneverende = !erUnderOppfolging;

    const perioder = useSelector(selectSorterteOppfolgingsperioder);
    const historiskePerioder = perioder.filter((periode) => periode.slutt !== undefined);
    const harHistoriskePerioder = historiskePerioder.length > 0;

    const dispatch = useAppDispatch();

    console.log(perioder);
    const nyestePeriode = perioder.length > 0 ? perioder[0] : null;

    useEffect(() => {
        if (nyestePeriode !== null) {
            dispatch(velgPeriode(nyestePeriode.id));
        }
    }, [perioder]);

    console.log(nyestePeriode);

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
                {perioder.map((oppfolgingsperiode, index) => {
                    const fraDato = format(new Date(oppfolgingsperiode.start), 'dd. MMM yyyy');
                    const navn =
                        oppfolgingsperiode.slutt === undefined
                            ? 'Nåværende periode'
                            : `${fraDato} - ${format(new Date(oppfolgingsperiode.slutt), 'dd. MMM yyyy')}`;
                    return (
                        <option value={oppfolgingsperiode.id} key={index}>
                            {navn}
                        </option>
                    );
                })}
            </Select>
        </div>
    );
};

export default PeriodeFilter;
