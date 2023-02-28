import { Checkbox as NavCheckbox } from '@navikt/ds-react';
import React, { ReactNode, useState } from 'react';

import { FieldStateInput } from './inputTypes';

interface Props {
    initialValue?: string;
    pristine?: boolean;
    touched: boolean;
    error?: boolean;
    input: FieldStateInput;
    setValue?: (value: string) => void;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
}
// pristine isn't used, but we don't want to pass it to input
const Checkbox = (props: Props) => {
    const { touched, error, input, pristine, initialValue, setValue, children, ...rest } = props;

    const inputProps = { ...input, ...rest };
    const [toggel, setToggel] = useState(initialValue === 'true');

    const toggelOnChange = (event: any) => {
        console.log('ONCHANGE ');
        const newValue = toggel ? 'false' : 'true';
        const customEvent: any = {
            target: { name: event.target.name, value: newValue },
        };
        input.onChange(customEvent);
        setToggel(!toggel);
    };

    console.log('CHECKBOX');

    const feil = error && touched ? error : undefined;
    return (
        <NavCheckbox error={feil} {...inputProps} checked={input.value === 'true'} onChange={toggelOnChange}>
            {children}
        </NavCheckbox>
    );
};

export default Checkbox;
