import { DateValidationT } from '@navikt/ds-react';
import { UNSAFE_DatePicker as DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';
import React from 'react';
import { ChangeEventHandler, MutableRefObject, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import {
    coerceToUndefined,
    handlers,
    preventCloseOnInsideClick,
    useOutsideClick,
    validateStandardDateErrors,
} from './common';
import { FieldSettings } from './ControlledDateRangePicker';

interface Props {
    field: FieldSettings;
    disabledDays?: any[];
}
const ControlledDatePicker = ({
    field: { disabled, name, defaultValue, required = false, label },
    disabledDays,
}: Props) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    useOutsideClick(isPopoverOpen, () => setIsPopoverOpen(false));

    const { control, setValue, setError, clearErrors } = useFormContext();
    const {
        field,
        fieldState: { error },
    } = useController({
        control,
        name: name,
    });
    const [validation, setValidation] = useState<DateValidationT | undefined>();
    const { inputProps, datepickerProps } = UNSAFE_useDatepicker({
        defaultSelected: defaultValue,
        onValidate: (validation) => {
            setValidation(validation);
        },
        disabled: disabledDays,
        onDateChange: (val) => {
            console.log('On data change', val);
            if (val) {
                setValue(name, val);
                const error = validateStandardDateErrors(validation, required);
                if (!error) clearErrors(name);
            }
            setIsPopoverOpen(false);
        },
    });
    const setHookFormValue: ChangeEventHandler<HTMLInputElement> = (event) => {
        console.log('Setting value', event.target.value);
        setValue(name, coerceToUndefined(event.target.value));
    };
    const validateInputs = () => {
        const error = validateStandardDateErrors(validation, required);
        if (error) setError(name, { message: error });
        else clearErrors(name);
    };
    /*  */
    const togglePopover = () => {
        setIsPopoverOpen(!isPopoverOpen);
    };
    // These extra div's minimizes the area that can be clicked that does not close the popover
    return (
        <div className="flex">
            <div onClick={preventCloseOnInsideClick}>
                <DatePicker {...datepickerProps} onOpenToggle={togglePopover} open={isPopoverOpen}>
                    <DatePicker.Input
                        disabled={disabled}
                        className="flex-1"
                        error={error?.message}
                        label={label ?? 'Dato' + (required ? ' (obligatorisk)' : '')}
                        {...inputProps}
                        name={name}
                        onBlur={handlers([field.onBlur, inputProps.onBlur, validateInputs])}
                        onChange={handlers([setHookFormValue, inputProps.onChange])}
                        ref={(ref) => {
                            (inputProps.ref as MutableRefObject<HTMLInputElement | null>).current = ref;
                            field.ref(ref);
                        }}
                    />
                </DatePicker>
            </div>
        </div>
    );
};
export default ControlledDatePicker;
