import React, { useState } from 'react';
import { Checkbox as NavCheckbox, CheckboxProps } from 'nav-frontend-skjema';
interface Input {
    value?: string;
    onChange: (a) => void;
}

interface Props {
    initialValue?: string;
    pristine?: boolean;
    touched: boolean;
    error?: string;
    input: Input;
}
// pristine isn't used, but we don't want to pass it to input
function Checkbox(props: Props & CheckboxProps) {
    const { touched, error, input, pristine, initialValue, ...rest } = props;

    const inputProps = { ...input, ...rest };
    const [toggel, setToggel] = useState(initialValue === 'true');

    const toggelOnChange = event => {
        const newValue = toggel ? 'false' : 'true';
        const customEvent = {
            target: { name: event.target.name, value: newValue }
        };
        input.onChange(customEvent);
        setToggel(!toggel);
    };

    const feil = error && touched ? { feilmelding: error } : undefined;
    return <NavCheckbox {...inputProps} checked={input.value === 'true'} feil={feil} onChange={toggelOnChange} />;
}

export default Checkbox;
