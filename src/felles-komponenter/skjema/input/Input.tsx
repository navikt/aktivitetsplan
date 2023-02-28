import { TextField as NavInput, TextFieldProps } from '@navikt/ds-react';
/* eslint-disable no-unused-vars */
import React from 'react';

import hiddenIfHOC from '../../hidden-if/hiddenIf';
import { FieldStateInput } from './inputTypes';

interface Props {
    touched: boolean;
    error?: string;
    input: FieldStateInput;
    pristine?: boolean;
    initialValue?: string;
    value?: string;
    setValue?: (value: string) => void;
}

// pristine and initialValue isn't used, but we don't want to pass it to input
const Input = (props: Props & TextFieldProps) => {
    const { touched, error, input, pristine, initialValue, setValue, ...rest } = props;
    const feil = error && touched ? error : undefined;
    const inputProps = { ...input, ...rest };
    return <NavInput {...inputProps} error={feil} required />;
};

export default Input;
export const HiddenIfInput = hiddenIfHOC(Input);
