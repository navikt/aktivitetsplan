import { Select as NavSelect, SelectProps } from 'nav-frontend-skjema';
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { FieldStateInput } from './inputTypes';

interface Props {
    initialValue?: string;
    pristine?: boolean;
    noBlankOption?: boolean;
    children: React.ReactNode;
    touched: boolean;
    error?: string;
    input: FieldStateInput;
}

// pristine and initialValue isn't used, but we don't want to pass it to input
const Select = (props: Props & SelectProps) => {
    const { touched, error, input, pristine, initialValue, noBlankOption, children, ...rest } = props;
    const feil = error && touched ? error : undefined;
    const inputProps = { ...input, ...rest };

    return (
        <NavSelect feil={feil} {...inputProps}>
            {!noBlankOption && <option />}
            {children}
        </NavSelect>
    );
};

export default Select;
