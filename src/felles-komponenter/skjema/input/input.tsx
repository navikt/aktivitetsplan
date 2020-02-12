/* eslint-disable no-unused-vars */
import React from 'react';
import { Input as NavInput, NavFrontendInputProps } from 'nav-frontend-skjema';
import hiddenIfHOC from '../../hidden-if/hidden-if';
import { FieldStateInput } from './utils';

interface Props {
    touched: boolean;
    error?: string;
    input: FieldStateInput;
    pristine?: boolean;
    initialValue?: string;
}

// pristine and initialValue isn't used, but we don't want to pass it to input
function Input(props: Props & NavFrontendInputProps) {
    const { touched, error, input, pristine, initialValue, ...rest } = props;
    const feil = error && touched ? { feilmelding: error } : undefined;
    const inputProps = { ...input, ...rest };
    return <NavInput {...inputProps} feil={feil} />;
}

export default Input;
export const HiddenIfInput = hiddenIfHOC(Input);
