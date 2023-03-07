import {
    UNSAFE_DatePicker as DatePicker,
    DateValidationT,
    UNSAFE_useDatepicker as useDatePicker,
} from '@navikt/ds-react';
import { MutableRefObject, RefCallback, forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form/dist/types/form';

interface Props {
    onChange?: (val: Date | undefined) => void;
    disabled?: any[];
    from: Date;
    initialToDate?: Date;
    error?: { from?: string; to?: string };
    onValidate?: (validation: DateValidationT) => void;
    fromRegisterProps?: UseFormRegisterReturn;
    toRegisterProps?: UseFormRegisterReturn;
}

export interface DateRange {
    from: Date;
    to?: Date;
}

export interface DateRangeValidation {
    from?: DateValidationT;
    to?: DateValidationT;
}

export const getErrorMessage = (val: DateRangeValidation): { from: string | undefined; to: string | undefined } => {
    return {
        from: val.from ? getErrorMessageForDate(val.from) : undefined,
        to: val.to ? getErrorMessageForDate(val.to) : undefined,
    };
};

export const getErrorMessageForDate = (val: DateValidationT): string | undefined => {
    if (val.isDisabled) return undefined;
    if (val.isEmpty) return 'Dato mangler';
    if (!val.isValidDate) return 'Datoen er ugyldig';
};

const PartialDateRangePicker = ({ onChange, from, onValidate, error, disabled, initialToDate }: Props) => {
    const { datepickerProps: fromDatePickerProps, inputProps: fromDateInputProps } = useDatePicker({
        fromDate: from,
        defaultSelected: from,
    });
    const { datepickerProps: toDatePickerProps, inputProps: toDateInputProps } = useDatePicker({
        onDateChange: onChange,
        onValidate: onValidate,
        disabled: disabled,
        defaultSelected: initialToDate,
    });
    return (
        <div className="flex flex-wrap justify-center gap-4 items-start">
            <DatePicker {...fromDatePickerProps}>
                <DatePicker.Input disabled label={'Fra dato'} {...fromDateInputProps} />
            </DatePicker>
            <DatePicker {...toDatePickerProps} disabled={[{ before: from }]}>
                <DatePicker.Input error={error?.to} label={'Til dato'} {...toDateInputProps} />
            </DatePicker>
        </div>
    );
};

export default PartialDateRangePicker;
