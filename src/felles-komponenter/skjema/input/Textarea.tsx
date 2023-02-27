import { Textarea as NavTextArea } from '@navikt/ds-react';
import React, { ForwardedRef, forwardRef } from 'react';

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
const Textarea = forwardRef((props: Props, ref: ForwardedRef<HTMLTextAreaElement | null>) => {
    const { touched, error, input, pristine, initialValue, required, setValue, maxLength, ...rest } = props;
    const feil = error && touched ? error : undefined;
    const inputProps = { ...input, ...rest };

    return <NavTextArea ref={ref} maxLength={props?.maxLength} error={feil} required={required} {...inputProps} />;
});

export default Textarea;
