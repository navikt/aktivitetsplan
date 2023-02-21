import { UNSAFE_DatePicker, UNSAFE_useRangeDatepicker } from '@navikt/ds-react';
import { RangeValidationT } from '@navikt/ds-react/esm/date/hooks/useRangeDatepicker';
import { useState } from 'react';

import { DateRange } from './PartialDateRangePicker';

interface Props {
    onChange: (val?: Partial<DateRange>) => void;
    disabledDays?: any[];
    value: Partial<DateRange> | undefined;
    from?: Date;
    error?: { from?: string; to?: string };
    onValidate: (validation: RangeValidationT) => void;
}
const DateRangePicker = ({ error, onChange, from, value, onValidate, disabledDays }: Props) => {
    const [toTouched, setToTouched] = useState(false);
    const [fromTouched, setFromTouched] = useState(false);
    const { datepickerProps, toInputProps, fromInputProps } = UNSAFE_useRangeDatepicker({
        defaultSelected: value && value.from ? (value as DateRange) : undefined,
        fromDate: from,
        disabled: disabledDays,
        onValidate,
        onRangeChange: onChange,
    });

    const onFromChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!fromInputProps.onChange) return;
        setFromTouched(true);
        fromInputProps.onChange(event);
    };
    const onToChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!toInputProps.onChange) return;
        setToTouched(true);
        toInputProps.onChange(event);
    };

    return (
        <UNSAFE_DatePicker {...datepickerProps}>
            <div className="flex flex-wrap justify-center gap-4 items-start">
                <UNSAFE_DatePicker.Input
                    error={fromTouched ? error?.from : undefined}
                    label={'Fra dato'}
                    {...fromInputProps}
                    onChange={onFromChange}
                />
                <UNSAFE_DatePicker.Input
                    error={toTouched ? error?.to : undefined}
                    label={'Til dato'}
                    {...toInputProps}
                    onChange={onToChange}
                />
            </div>
        </UNSAFE_DatePicker>
    );
};

export default DateRangePicker;
