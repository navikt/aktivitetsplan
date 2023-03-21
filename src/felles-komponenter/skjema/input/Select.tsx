/* eslint-disable jsx-a11y/control-has-associated-label */
import { Select as NavSelect, SelectProps } from '@navikt/ds-react';
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
    setValue?: (value: string) => void;
}

// pristine and initialValue isn't used, but we don't want to pass it to input
const Select = (props: Props & SelectProps) => {
    const { touched, error, input, pristine, initialValue, noBlankOption, children, setValue, ...rest } = props;
    const feil = error && touched ? error : undefined;
    const inputProps = { ...input, ...rest };

    return (
        <NavSelect error={feil} {...inputProps}>
            {!noBlankOption && <option />}
            {children}
        </NavSelect>
    );
};

export default Select;
