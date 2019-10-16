import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';

interface UtskriftValgProps {
    tittelId: string;
    tekstId: string;
}

function UtskriftValg(props: UtskriftValgProps) {
    return (
        <div>
            <Undertittel>{props.tittelId}</Undertittel>
            <Normaltekst>{props.tekstId}</Normaltekst>
        </div>
    );
}

export default UtskriftValg;
