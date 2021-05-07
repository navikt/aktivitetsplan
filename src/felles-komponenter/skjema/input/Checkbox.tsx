import { CheckboxProps, Checkbox as NavCheckbox } from 'nav-frontend-skjema';
import React, { useState } from 'react';

import { FieldStateInput } from './inputTypes';

interface Props {
    initialValue?: string;
    pristine?: boolean;
    touched: boolean;
    error?: string;
    input: FieldStateInput;
    setValue: (value: string) => void;
}
// pristine isn't used, but we don't want to pass it to input
const Checkbox = (props: Props & CheckboxProps) => {
    const { touched, error, input, pristine, initialValue, setValue, ...rest } = props;

    const inputProps = { ...input, ...rest };
    const [toggel, setToggel] = useState(initialValue === 'true');

    const toggelOnChange = (event: any) => {
        const newValue = toggel ? 'false' : 'true';
        const customEvent: any = {
            target: { name: event.target.name, value: newValue },
        };
        input.onChange(customEvent);
        setToggel(!toggel);
    };

    const feil = error && touched ? error : undefined;
    return <NavCheckbox {...inputProps} checked={input.value === 'true'} feil={feil} onChange={toggelOnChange} />;
};

export default Checkbox;
