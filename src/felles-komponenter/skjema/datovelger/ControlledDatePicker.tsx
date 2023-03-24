import { UNSAFE_DatePicker as DatePicker, DateValidationT, UNSAFE_useDatepicker } from '@navikt/ds-react';
import { useDatepicker } from '@navikt/ds-react/esm/date/hooks/useDatepicker';
import { getLocaleFromString, parseDate } from '@navikt/ds-react/esm/date/utils';
import { format, isValid } from 'date-fns';
import { da } from 'date-fns/locale';
import React, { useEffect } from 'react';
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

const nb = getLocaleFromString('nb');
const ControlledDatePicker = ({
    field: { disabled, name, defaultValue, required = false, label },
    disabledDays,
}: Props) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    useOutsideClick(isPopoverOpen, () => setIsPopoverOpen(false));

    const [generalError, setGeneralError] = useState<string | undefined>(undefined);

    const { control, setValue } = useFormContext();
    const {
        field,
        fieldState: { error },
    } = useController({
        control,
        name: name,
    });

    const [validation, setValidation] = useState<DateValidationT | undefined>();

    /*
    const { inputProps, datepickerProps } = UNSAFE_useDatepicker({
        defaultSelected: defaultValue,
        onValidate: (validation) => {
            setValidation(validation);
            const error = validateStandardDateErrors(validation, required);
            if (!error) setGeneralError(error);
        },
        disabled: disabledDays,
        onDateChange: (val) => {
            console.log('On date change', val);
            if (val) {
                setValue(name, val);
            }
            setIsPopoverOpen(false);
        },
    });*/
    /*
    useEffect(() => {
        // console.log(inputProps);
        const error = validateStandardDateErrors(validation, required);
        if (error || !coerceToUndefined(inputProps.value)) return;
        setValue(name, coerceToUndefined(inputProps.value));
        trigger(name);
        console.log('Good date', inputProps.value);
    }, [inputProps.value, validation]);*/
    /*
    const setHookFormValue: ChangeEventHandler<HTMLInputElement> = (event) => {
        console.log('Setting hook form value', coerceToUndefined(event.target.value));
        setValue(name, coerceToUndefined(event.target.value));
    };
    const syncFormStateWithDatepickerState = () => {
        const error = validateStandardDateErrors(validation, required);
        if (error || !coerceToUndefined(inputProps.value)) return;
        setValue(name, coerceToUndefined(inputProps.value));
        console.log('Good date', inputProps.value);
    };*/

    const [displayValue, setDisplayValue] = useState<string | undefined>(undefined);

    const validateInputs = () => {
        const error = validateStandardDateErrors(validation, required);
        if (error) setGeneralError(error);
        else setGeneralError(undefined);
    };

    const onChange = (e) => {
        // console.log(e);
        const day = parseDate(e.target.value, new Date(), nb, 'date', true);
        setValue(name, day);
        setDisplayValue(e.target.value);
        // console.log(day);
    };

    const onChangeDate = (e) => {
        console.log('OnChangeDate', e);
    };

    const formatDate = () => {
        if (!isValid(field.value)) return;
        setDisplayValue(format(field.value, 'dd.M.y'));
    };

    /*  */
    const togglePopover = () => {
        setIsPopoverOpen(!isPopoverOpen);
    };
    // These extra div's minimizes the area that can be clicked that does not close the popover
    return (
        <div className="flex">
            <div onClick={preventCloseOnInsideClick}>
                <DatePicker onChange={onChangeDate} onOpenToggle={togglePopover} open={isPopoverOpen}>
                    <DatePicker.Input
                        disabled={disabled}
                        className="flex-1"
                        error={error?.message ?? generalError}
                        label={label ?? 'Dato' + (required ? ' (obligatorisk)' : '')}
                        name={name}
                        value={displayValue}
                        onBlur={handlers([field.onBlur, formatDate])}
                        onChange={handlers([onChange])}
                        ref={field.ref}
                    />
                </DatePicker>
            </div>
        </div>
    );
};
export default ControlledDatePicker;
