import { DatePicker, useRangeDatepicker } from '@navikt/ds-react';
import { RangeValidationT } from '@navikt/ds-react/esm/date/hooks/useRangeDatepicker';
import { MutableRefObject, RefCallback } from 'react';
import { UseFormRegisterReturn, UseFormTrigger } from 'react-hook-form/dist/types/form';

import { DateRange } from './common';

interface Props {
    onChange?: (val?: Partial<DateRange>) => void;
    onValidate: (val: RangeValidationT) => void;
    disabledDays?: any[];
    defaultValue?: Partial<DateRange> | undefined;
    from?: Date;
    error?: { from?: string; to?: string };
    onChangeTo: (to?: Date) => void;
    onChangeFrom: (from?: Date) => void;
    toRef?: RefCallback<HTMLInputElement>;
    fromRef?: RefCallback<HTMLInputElement>;
    toRegisterProps: UseFormRegisterReturn;
    fromRegisterProps: UseFormRegisterReturn;
    trigger: UseFormTrigger<any>;
}

const handlers = (handlers: React.FocusEventHandler[]) => (event: React.FocusEvent) => {
    handlers.forEach((handler) => handler(event));
};
const onChangeHandlers =
    (handlers: React.ChangeEventHandler<HTMLInputElement>[]) => (event: React.ChangeEvent<HTMLInputElement>) => {
        handlers.forEach((handler) => handler(event));
    };

const DateRangePicker = ({
    error,
    onValidate,
    onChangeTo,
    onChangeFrom,
    from,
    trigger,
    defaultValue,
    disabledDays,
    toRegisterProps,
    fromRegisterProps,
}: Props) => {
    const { datepickerProps, toInputProps, fromInputProps } = useRangeDatepicker({
        defaultSelected: defaultValue?.from ? { from: defaultValue.from, to: undefined } : undefined,
        fromDate: from,
        disabled: disabledDays,
        onValidate: onValidate,
        onRangeChange: async (val) => {
            if (!val) return;
            onChangeTo(val.to);
            onChangeFrom(val.from);
        },
    });

    const triggerValidation = () => {
        trigger([fromRegisterProps.name, toRegisterProps.name]);
    };

    return (
        <div className="flex">
            <DatePicker {...datepickerProps} wrapperClassName="flex flex-1">
                <DatePicker.Input
                    error={error?.from}
                    label={'Fra dato'}
                    {...fromInputProps}
                    onChange={onChangeHandlers([fromInputProps.onChange as any, fromRegisterProps.onChange])}
                    onBlur={handlers([fromInputProps.onBlur as any, fromRegisterProps.onBlur, triggerValidation])}
                    name={fromRegisterProps.name}
                    ref={(ref) => {
                        (fromInputProps.ref as MutableRefObject<HTMLInputElement | null>).current = ref;
                        fromRegisterProps.ref(ref);
                    }}
                />
                <DatePicker.Input
                    error={error?.to}
                    label={'Til dato'}
                    {...toInputProps}
                    onChange={onChangeHandlers([toInputProps.onChange as any, toRegisterProps.onChange])}
                    onBlur={handlers([toInputProps.onBlur as any, toRegisterProps.onBlur, triggerValidation])}
                    name={toRegisterProps.name}
                    ref={(ref) => {
                        (toInputProps.ref as MutableRefObject<HTMLInputElement | null>).current = ref;
                        toRegisterProps.ref(ref);
                    }}
                />
            </DatePicker>
        </div>
    );
};

export default DateRangePicker;
