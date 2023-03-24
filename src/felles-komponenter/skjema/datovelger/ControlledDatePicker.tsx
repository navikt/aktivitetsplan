import { UNSAFE_DatePicker as DatePicker } from '@navikt/ds-react';
import { getLocaleFromString, parseDate } from '@navikt/ds-react/esm/date/utils';
import { format, isValid } from 'date-fns';
import React, { ChangeEventHandler } from 'react';
import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { handlers, preventCloseOnInsideClick, useOutsideClick } from './common';
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

    const { control, setValue } = useFormContext();
    const {
        field,
        fieldState: { error },
    } = useController({
        control,
        defaultValue,
        name: name,
    });

    const [displayValue, setDisplayValue] = useState<string>('');

    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const day = parseDate(event.target.value, new Date(), nb, 'date', true);
        setValue(name, day);
        setDisplayValue(event.target.value);
    };

    const onChangeDate = (date?: Date) => {
        setValue(name, date);
        setDisplayValue(date ? format(date, 'dd.M.y') : '');
    };

    const formatDate = () => {
        if (!isValid(field.value)) return;
        setDisplayValue(format(field.value, 'dd.M.y'));
    };
    const togglePopover = () => {
        setIsPopoverOpen(!isPopoverOpen);
    };
    // These extra div's minimizes the area that can be clicked that does not close the popover
    return (
        <div className="flex">
            <div onClick={preventCloseOnInsideClick}>
                <DatePicker
                    onSelect={onChangeDate}
                    disabled={disabledDays}
                    onOpenToggle={togglePopover}
                    open={isPopoverOpen}
                >
                    <DatePicker.Input
                        disabled={disabled}
                        className="flex-1"
                        error={error?.message}
                        label={label ?? 'Dato' + (required ? ' (obligatorisk)' : '')}
                        name={name}
                        value={displayValue}
                        onBlur={handlers([field.onBlur, formatDate])}
                        onChange={onChange}
                        ref={field.ref}
                    />
                </DatePicker>
            </div>
        </div>
    );
};
export default ControlledDatePicker;
