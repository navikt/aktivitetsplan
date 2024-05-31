import { DatePicker } from '@navikt/ds-react';
import { format, isValid } from 'date-fns';
import React, { ChangeEventHandler, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { preventCloseOnInsideClick, useOutsideClick } from './common';
import { FieldSettings } from './ControlledDateRangePicker';
import { isValidDate } from '../../../utils/dateUtils';
import { parseDate } from '../../../utils/dateParser';
import nb from 'date-fns/locale/nb';

interface Props {
    field: FieldSettings;
    disabledDays?: any[];
}

const ControlledDatePicker = ({
    field: { disabled, name, defaultValue, required = false, label },
    disabledDays,
}: Props) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const closePopover = () => setIsPopoverOpen(false);
    useOutsideClick(isPopoverOpen, closePopover);

    const { control, setValue, clearErrors } = useFormContext();
    const {
        field,
        fieldState: { error },
    } = useController({
        control,
        defaultValue,
        name: name,
    });

    const [displayValue, setDisplayValue] = useState<string>(defaultValue ? format(defaultValue, 'dd.M.y') : '');

    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const day = parseDate(event.target.value, new Date(), 'date', true);
        if (isValidDate(day)) {
            setValue(name, day);
        } else {
            setValue(name, undefined);
        }
        setDisplayValue(event.target.value);
        if (isValid(day)) {
            closePopover();
            clearErrors(name);
        }
    };

    const onChangeDate = (date?: Date) => {
        setValue(name, date, { shouldDirty: true });
        setDisplayValue(date ? format(date, 'dd.M.y') : '');
        if (date) {
            closePopover();
            clearErrors(name);
        }
    };

    const onBlur = () => {
        field.onBlur();
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
                    onClose={() => {
                        setIsPopoverOpen(false);
                    }}
                    onSelect={onChangeDate}
                    selected={isValid(field.value) ? field.value : undefined}
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
                        onBlur={onBlur}
                        onChange={onChange}
                        ref={field.ref}
                    />
                </DatePicker>
            </div>
        </div>
    );
};
export default ControlledDatePicker;
