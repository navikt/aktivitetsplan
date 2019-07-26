import React from 'react';
import { Textarea as NavFrontendTextarea } from 'nav-frontend-skjema';

export function getTellerTekst(antallTegn, maxLength, visTellerFra) {
    const tegnIgjen = maxLength - antallTegn;
    const tegnForMange = antallTegn - maxLength;
    const tellerFra = visTellerFra || maxLength / 10;

    if (tegnForMange > 0) {
        return `Du har ${tegnForMange} tegn for mye`;
    }
    if (tegnIgjen <= tellerFra) {
        return `Du har ${tegnIgjen} tegn igjen`;
    }
    return null;
}

function InnerTextAreaComponent({ visTellerFra, ...rest }) {
    return (
        <NavFrontendTextarea
            textareaClass="skjemaelement__input input--fullbredde"
            tellerTekst={antallTegn =>
                getTellerTekst(antallTegn, 1, visTellerFra)}
            {...rest}
        />
    );
}
