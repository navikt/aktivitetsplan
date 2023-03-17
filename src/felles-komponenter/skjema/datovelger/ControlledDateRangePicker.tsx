import { UNSAFE_DatePicker as DatePicker, UNSAFE_useRangeDatepicker } from '@navikt/ds-react';
import { RangeValidationT } from '@navikt/ds-react/esm/date/hooks/useRangeDatepicker';
import React from 'react';
import { ChangeEventHandler, MutableRefObject, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { coerceToUndefined, handlers, preventCloseOnInsideClick, useOutsideClick } from './common';

export interface FieldSettings {
    name: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    defaultValue?: Date;
}

interface Props {
    disabledDays?: any[];
    from: FieldSettings;
    to: FieldSettings;
}

const DateRangePicker = ({ from, to, disabledDays }: Props) => {
    /* Handle popover state self because it's used inside a web component which causes event.target to be showDom-root */
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const openToggle = () => setIsPopoverOpen(true);
    const closeToggle = () => setIsPopoverOpen(false);
    useOutsideClick(isPopoverOpen, closeToggle);

    const { setError, clearErrors, control, setValue } = useFormContext();
    const { field: fromField, fieldState: fromState } = useController({
        control,
        name: from.name,
        defaultValue: from.defaultValue ?? undefined,
    });
    const { field: toField, fieldState: toState } = useController({
        control,
        name: to.name,
        defaultValue: to.defaultValue ?? undefined,
    });

    const [rangeValidation, setRangeValidation] = useState<RangeValidationT | undefined>(undefined);

    const validateRemoveErrors = (rangeValidation: RangeValidationT) => {
        if (!rangeValidation) return;
        if (rangeValidation.from.isValidDate || (!from.required && rangeValidation.from.isEmpty)) {
            clearErrors([from.name]);
        }
        if (rangeValidation.to.isValidDate || (!to.required && rangeValidation.to.isEmpty)) {
            clearErrors(to.name);
        }
    };
    const validateInputs = () => {
        if (!rangeValidation) return;
        if (fromState.isTouched && !rangeValidation.from.isEmpty && rangeValidation.from.isInvalid) {
            setError(from.name, { message: 'Ikke en gyldig dato' });
        }
        if (toState.isTouched && !rangeValidation.to.isEmpty && rangeValidation.to.isInvalid) {
            setError(to.name, { message: 'Ikke en gyldig dato' });
        }
        validateRemoveErrors(rangeValidation);
    };

    const { datepickerProps, toInputProps, fromInputProps } = UNSAFE_useRangeDatepicker({
        defaultSelected: { from: from.defaultValue, to: to.defaultValue },
        disabled: disabledDays,
        onValidate: (validation) => {
            setRangeValidation(validation);
            validateRemoveErrors(validation);
        },
        onRangeChange: (val) => {
            setValue(to.name, coerceToUndefined(val?.to));
            setValue(from.name, coerceToUndefined(val?.from));
            if (val?.to != undefined && val.from !== undefined) {
                closeToggle();
            }
        },
    });

    /* These on-change handlers are needed to handle manual text-input */
    const setHookFormFromValue: ChangeEventHandler<HTMLInputElement> = (event) => {
        setValue(from.name, coerceToUndefined(event.target.value));
    };
    const setHookFormToValue: ChangeEventHandler<HTMLInputElement> = (event) => {
        setValue(from.name, coerceToUndefined(event.target.value));
    };

    return (
        <div className="flex flex-1" onClick={preventCloseOnInsideClick}>
            <DatePicker
                {...datepickerProps}
                open={isPopoverOpen}
                onOpenToggle={() => setIsPopoverOpen(!isPopoverOpen)}
                wrapperClassName="flex flex-1"
            >
                <div className="flex flex-1 items-start gap-y-2 gap-x-6 flex-wrap">
                    <DatePicker.Input
                        disabled={from.disabled}
                        className="flex-1"
                        error={fromState.error?.message}
                        label={from?.label ?? `Fra dato ${from.required ? '(obligatorisk)' : '(valgfri)'}`}
                        {...fromInputProps}
                        name={fromField.name}
                        onFocus={handlers([fromInputProps.onFocus, openToggle])}
                        onBlur={handlers([fromField.onBlur, fromInputProps.onBlur, validateInputs, closeToggle])}
                        onChange={handlers([setHookFormFromValue, fromInputProps.onChange])}
                        ref={(ref) => {
                            (fromInputProps.ref as MutableRefObject<HTMLInputElement | null>).current = ref;
                            fromField.ref(ref);
                        }}
                    />
                    <DatePicker.Input
                        className="flex-1"
                        error={toState.error?.message}
                        label={to?.label ?? `Til dato ${to.required ? '(obligatorisk)' : '(valgfri)'}`}
                        {...toInputProps}
                        name={toField.name}
                        onFocus={handlers([toInputProps.onFocus, openToggle])}
                        onBlur={handlers([toField.onBlur, toInputProps.onBlur, validateInputs, closeToggle])}
                        onChange={handlers([setHookFormToValue, toInputProps.onChange])}
                        ref={(ref) => {
                            (toInputProps.ref as MutableRefObject<HTMLInputElement | null>).current = ref;
                            toField.ref(ref);
                        }}
                    />
                </div>
            </DatePicker>
        </div>
    );
};

export default DateRangePicker;
