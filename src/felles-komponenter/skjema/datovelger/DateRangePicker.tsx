import { UNSAFE_DatePicker as DatePicker, UNSAFE_useRangeDatepicker } from '@navikt/ds-react';
import { RangeValidationT } from '@navikt/ds-react/esm/date/hooks/useRangeDatepicker';
import { MutableRefObject, RefCallback } from 'react';

import { DateRange } from './PartialDateRangePicker';

interface Props {
    onChange?: (val?: Partial<DateRange>) => void;
    disabledDays?: any[];
    value?: Partial<DateRange> | undefined;
    from?: Date;
    error?: { from?: string; to?: string };
    onValidate?: (validation: RangeValidationT) => void;
    fromRef?: RefCallback<any>;
    toRef?: RefCallback<any>;
}

const DateRangePicker = ({ error, onChange, from, value, onValidate, disabledDays, fromRef, toRef }: Props) => {
    const { datepickerProps, toInputProps, fromInputProps } = UNSAFE_useRangeDatepicker({
        defaultSelected: value?.from ? { from: value.from, to: undefined } : undefined,
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
            <DatePicker {...datepickerProps} wrapperClassName="flex flex-1">
                <div className="flex flex-1 items-start gap-2">
                    <DatePicker.Input
                        className="flex-1"
                        error={error?.from}
                        label={'Fra dato'}
                        {...fromInputProps}
                        onChange={onFromChange}
                        ref={(element) => {
                            (fromInputProps.ref as MutableRefObject<HTMLInputElement | null>).current = element;
                            fromRef && fromRef(element);
                        }}
                    />
                    <DatePicker.Input
                        className="flex-1"
                        error={error?.to}
                        label={'Til dato'}
                        {...toInputProps}
                        onChange={onToChange}
                        ref={(element) => {
                            (toInputProps.ref as MutableRefObject<HTMLInputElement | null>).current = element;
                            toRef && toRef(element);
                        }}
                    />
                </div>
            </DatePicker>
        </div>
    );
};

export default DateRangePicker;
