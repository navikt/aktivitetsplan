import { DateValidationT, UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';

interface Props {
    onChange: (val: Date | undefined) => void;
    disabled?: any[];
    from: Date;
    error?: { from?: string; to?: string };
    onValidate: (validation: DateValidationT) => void;
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

const PartialDateRangePicker = ({ onChange, from, onValidate, error, disabled }: Props) => {
    const { datepickerProps: fromDatePickerProps, inputProps: fromDateInputProps } = UNSAFE_useDatepicker({
        fromDate: from,
        defaultSelected: from,
    });
    const { datepickerProps: toDatePickerProps, inputProps: toDateInputProps } = UNSAFE_useDatepicker({
        onDateChange: onChange,
        onValidate: onValidate,
        disabled: disabled,
    });
    return (
        <div className="flex flex-wrap justify-center gap-4 items-start">
            <UNSAFE_DatePicker {...fromDatePickerProps}>
                <UNSAFE_DatePicker.Input disabled label={'Fra dato'} {...fromDateInputProps} />
            </UNSAFE_DatePicker>
            <UNSAFE_DatePicker {...toDatePickerProps} disabled={[{ before: from }]}>
                <UNSAFE_DatePicker.Input error={error?.to} label={'Til dato'} {...toDateInputProps} />
            </UNSAFE_DatePicker>
        </div>
    );
};

export default PartialDateRangePicker;
