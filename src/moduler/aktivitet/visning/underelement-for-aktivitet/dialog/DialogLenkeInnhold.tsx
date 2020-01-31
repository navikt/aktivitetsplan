import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

interface MessagProps {
    titel: string;
    undertekst?: string;
}

function Message(props: MessagProps) {
    const { titel, undertekst } = props;
    if (undertekst) {
        return (
            <div>
                <Element>{titel}</Element>
                <Normaltekst>{undertekst}</Normaltekst>
            </div>
        );
    }
    return <Element>{titel}</Element>;
}

const melding_er = (antall: number) => (antall > 1 ? 'meldinger' : 'melding');

interface DailogLenkeInnholdProps {
    henvendelser: number;
    uleste: number;
    erVeileder: boolean;
}

const DailogLenkeInnhold = (props: DailogLenkeInnholdProps) => {
    const { henvendelser, uleste, erVeileder } = props;

    if (!henvendelser) {
        const underteks = erVeileder ? undefined : 'til veilederen din';
        return <Message titel="Send en melding om aktiviteten" undertekst={underteks} />;
    }

    if (uleste) {
        const titel = uleste === 1 ? '1 ulest melding' : `${uleste} uleste meldinger`;
        return <Message titel={titel} />;
    }

    return <Message titel={`Se ${henvendelser} ${melding_er(henvendelser)} om aktiviteten`} />;
};

export default DailogLenkeInnhold;
