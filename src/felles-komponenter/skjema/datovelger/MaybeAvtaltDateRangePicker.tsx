import React, { useMemo } from 'react';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import ControlledDatePicker from './ControlledDatePicker';
import ControlledDateRangePicker, { FieldSettings } from './DateRangePicker';
import { Matcher } from './Matcher';

interface Props {
    aktivitet?: AlleAktiviteter;
    disabled?: Matcher[];
    from: FieldSettings;
    to: FieldSettings;
}
function MaybeAvtaltDateRangePicker({ aktivitet, from, to }: Props) {
    const defaultToValue = useMemo(() => {
        return aktivitet?.tilDato ? new Date(aktivitet.tilDato) : to.defaultValue;
    }, [aktivitet?.tilDato, to.defaultValue]);

    const defaultFromValue = useMemo(
        () => (aktivitet?.fraDato ? new Date(aktivitet.fraDato) : from.defaultValue),
        [aktivitet?.tilDato, from.defaultValue],
    );

    return aktivitet && aktivitet.avtalt && aktivitet.fraDato ? (
        <div className="flex gap-4">
            <ControlledDatePicker field={{ ...from, disabled: true, defaultValue: defaultFromValue }} />
            <ControlledDatePicker
                field={{ ...to, defaultValue: defaultToValue }}
                disabledDays={defaultFromValue ? [{ before: defaultFromValue }] : []}
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
