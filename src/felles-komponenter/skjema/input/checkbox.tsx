import React, { useState } from 'react';
import { Checkbox as NavCheckbox, CheckboxProps } from 'nav-frontend-skjema';
import { FieldState } from '@nutgaard/use-formstate';

interface Props {
    initialValue?: string;
    pristine?: boolean;
    touched: boolean;
    error?: string;
    input: FieldState['input'];
}
// pristine isn't used, but we don't want to pass it to input
function Checkbox(props: Props & CheckboxProps) {
    const { touched, error, input, pristine, initialValue, ...rest } = props;

    const inputProps = { ...input, ...rest };
    const [toggel, setToggel] = useState(initialValue === 'true');

    const toggelOnChange = (event: any) => {
        const newValue = toggel ? 'false' : 'true';
        const customEvent: any = {
            target: { name: event.target.name, value: newValue }
        };
        input.onChange(customEvent);
        setToggel(!toggel);
    };

    const feil = error && touched ? { feilmelding: error } : undefined;
    return <NavCheckbox {...inputProps} checked={input.value === 'true'} feil={feil} onChange={toggelOnChange} />;
}

export default Checkbox;
