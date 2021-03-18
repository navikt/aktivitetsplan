import { Textarea as NavTextArea } from 'nav-frontend-skjema';
import React from 'react';

const getTellerTekst = (antallTegn: number, maxLength: number, visTellerFra?: number) => {
    const tegnIgjen = maxLength - antallTegn;
    const tegnForMange = antallTegn - maxLength;
    const tellerFra = visTellerFra || maxLength;

    if (tegnForMange > 0) {
        return `Du har ${tegnForMange} tegn for mye`;
    }
    if (tegnIgjen <= tellerFra) {
        return `Du har ${tegnIgjen} tegn igjen`;
    }
    return null;
};

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
}

// pristine and initialValue isn't used, but we don't want to pass it to input
const Textarea = (props: Props) => {
    const { touched, error, input, pristine, initialValue, visTellerFra, required, ...rest } = props;
    const feil = error && touched ? error : undefined;
    const inputProps = { ...input, ...rest };

    return (
        <NavTextArea
            tellerTekst={(antallTegn, max) => getTellerTekst(antallTegn, max, visTellerFra)}
            feil={feil}
            required={required}
            {...inputProps}
        />
    );
};

export default Textarea;
