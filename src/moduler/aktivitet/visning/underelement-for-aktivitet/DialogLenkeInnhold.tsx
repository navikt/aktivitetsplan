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
            <>
                <Element>{titel}</Element>
                <Normaltekst>{undertekst}</Normaltekst>
            </>
        );
    }
    return <Element>{titel}</Element>;
}

const melding_er = (antall: number) => (antall > 1 ? 'meldinger' : 'melding');

interface TeksProps {
    henvendelser: number;
    uleste: number;
    erVeileder: boolean;
}

const DailogLenkeInnhold = (props: TeksProps) => {
    const { henvendelser, uleste, erVeileder } = props;
    if (!henvendelser) {
        const underteks = erVeileder ? undefined : 'til veilederen din';
        return <Message titel="Send en melding om aktiviteten" undertekst={underteks} />;
    }
    if (uleste) {
        const titel = `${uleste} uleste ${melding_er(uleste)}`;
        const meldinger = `Totalt ${henvendelser} ${melding_er(henvendelser)} om aktiviteten`;
        return <Message titel={titel} undertekst={meldinger} />;
    }

    return <Message titel={`Se ${henvendelser} ${melding_er(henvendelser)} om denne aktiviteten`} />;
};

export default DailogLenkeInnhold;
