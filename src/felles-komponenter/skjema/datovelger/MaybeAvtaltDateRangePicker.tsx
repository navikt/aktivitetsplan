import { Formstate } from '@nutgaard/use-formstate';
import React, { useState } from 'react';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import DateRangePicker from './DateRangePicker';
import PartialDateRangePicker, { DateRange } from './PartialDateRangePicker';

type FormValuesWithDates = { fraDato: string; tilDato: string };
function getError<T extends FormValuesWithDates>(
    state: Formstate<T>,
    field: 'fraDato' | 'tilDato'
): string | undefined {
    return state.fields[field].touched ? state.errors[field] : undefined;
}

interface Props<T extends FormValuesWithDates> {
    formState: Formstate<T>;
    aktivitet?: AlleAktiviteter;
    initialFromDate?: Date;
    initialToDate?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noOp = () => {};
function MaybeAvtaltDateRangePicker<T extends FormValuesWithDates>({
    aktivitet,
    formState,
    initialFromDate,
    initialToDate,
}: Props<T>) {
    const [dateRange, setDateRange] = useState<Partial<DateRange>>({
        from: initialFromDate ? new Date(initialFromDate) : undefined,
        to: initialToDate,
    });
    const onChangeDate = (val: Date | undefined) => {
        setDateRange({ ...dateRange, to: val });
        formState.setValue('tilDato', val?.toISOString() || '');
    };
    const onChangeDateRange = (val: Partial<DateRange> | undefined) => {
        setDateRange({ from: val?.from, to: val?.to });
        formState.setValue('fraDato', val?.from?.toISOString() || '');
        formState.setValue('tilDato', val?.to?.toISOString() || '');
    };

    return aktivitet && aktivitet.avtalt && aktivitet.fraDato ? (
        <PartialDateRangePicker
            onChange={onChangeDate}
            from={new Date(aktivitet.fraDato)}
            onValidate={noOp}
            initialToDate={initialToDate}
            error={{ to: getError(formState, 'tilDato') }}
        />
    ) : (
        <DateRangePicker
            onChange={onChangeDateRange}
            value={dateRange}
            onValidate={noOp}
            error={{
                /* Error message doesn't fit in form, but still want to make field red when missing */
                from: getError(formState, 'fraDato'),
                to: getError(formState, 'tilDato'),
            }}
        />
    );
}

export default MaybeAvtaltDateRangePicker;
