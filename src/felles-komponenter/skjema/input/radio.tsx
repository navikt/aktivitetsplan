/* eslint-disable no-unused-vars */
import React from 'react';
import { Radio as NavRadio } from 'nav-frontend-skjema';
import { FieldState } from '@nutgaard/use-formstate';

interface RadioProps {
    id?: string;
    initialValue?: string;
    className?: string;
    disabled?: boolean;
    value: string;
    label: React.ReactNode;
    pristine?: boolean;
    touched: boolean;
    error?: string;
    input: FieldState['input'];
}

// pristine and initialValue isn't used, but we don't want to pass it to input
function Radio(props: RadioProps) {
    const { value, touched, error, input, pristine, initialValue, ...rest } = props;
    const inputProps = { ...input, ...rest };

    return <NavRadio {...inputProps} value={value} checked={value === input.value} id={`id--${value}`} />;
}

export default Radio;
