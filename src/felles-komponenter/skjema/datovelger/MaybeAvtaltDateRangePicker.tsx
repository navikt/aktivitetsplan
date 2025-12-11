import React from 'react';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import ControlledDatePicker from './ControlledDatePicker';
import ControlledDateRangePicker, { FieldSettings } from './DateRangePicker';

type FormValuesWithDates = { fraDato: string; tilDato: string };

interface Props<T extends FormValuesWithDates> {
    aktivitet?: AlleAktiviteter;
    disabled?: any[];
    from: FieldSettings;
    to: FieldSettings;
}
function MaybeAvtaltDateRangePicker<T extends FormValuesWithDates>({ aktivitet, from, to }: Props<T>) {
    const defaultToValue = aktivitet?.tilDato ? new Date(aktivitet.tilDato) : to.defaultValue;
    const defaultFromValue = aktivitet?.fraDato ? new Date(aktivitet.fraDato) : from.defaultValue;
    return aktivitet && aktivitet.avtalt && aktivitet.fraDato ? (
        <div className="flex gap-4">
            <ControlledDatePicker field={{ ...from, disabled: true, defaultValue: defaultFromValue }} />
            <ControlledDatePicker
                field={{ ...to, defaultValue: defaultToValue }}
                disabledDays={[{ before: defaultFromValue }]}
            />
        </div>
    ) : (
        <ControlledDateRangePicker
            from={{ defaultValue: defaultFromValue, ...from }}
            to={{ defaultValue: defaultToValue, ...to }}
        />
    );
}

export default MaybeAvtaltDateRangePicker;
