import { UNSAFE_DatePicker, UNSAFE_useRangeDatepicker } from '@navikt/ds-react';
import { RangeValidationT } from '@navikt/ds-react/esm/date/hooks/useRangeDatepicker';

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
    const { datepickerProps, toInputProps, fromInputProps } = UNSAFE_useRangeDatepicker({
        defaultSelected: value && value.from ? (value as DateRange) : undefined,
        fromDate: from,
        disabled: disabledDays,
        onValidate,
        onRangeChange: onChange,
    });

    const onFromChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!fromInputProps.onChange) return;
        fromInputProps.onChange(event);
    };
    const onToChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!toInputProps.onChange) return;
        toInputProps.onChange(event);
    };

    return (
        <div className="flex flex-1">
            <UNSAFE_DatePicker {...datepickerProps} wrapperClassName="flex flex-1">
                <div className="flex flex-1 items-start gap-2">
                    <UNSAFE_DatePicker.Input
                        className="flex-1"
                        error={error?.from}
                        label={'Fra dato'}
                        {...fromInputProps}
                        onChange={onFromChange}
                    />
                    <UNSAFE_DatePicker.Input
                        className="flex-1"
                        error={error?.to}
                        label={'Til dato'}
                        {...toInputProps}
                        onChange={onToChange}
                    />
                </div>
            </UNSAFE_DatePicker>
        </div>
    );
};

export default DateRangePicker;
