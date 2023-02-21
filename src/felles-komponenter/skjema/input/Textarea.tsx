import { Textarea as NavTextArea } from '@navikt/ds-react';
import React from 'react';

interface Input {
    value: string;
    onChange: (a: any) => void;
}

interface Props {
    initialValue?: string;
    pristine?: boolean;
    touched: boolean;
    error?: string;
    input: Input;
    visTellerFra?: number;
    maxLength: number;
    label: any;
    autoFocus?: boolean;
    textareaClass?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    setValue?: (value: string) => void;
}

// pristine and initialValue isn't used, but we don't want to pass it to input
const Textarea = (props: Props) => {
    const { touched, error, input, pristine, initialValue, visTellerFra, required, setValue, maxLength, ...rest } =
        props;
    const feil = error && touched ? error : undefined;
    const inputProps = { ...input, ...rest };

    return <NavTextArea maxLength={props?.maxLength} error={feil} required={required} {...inputProps} />;
};

export default Textarea;
