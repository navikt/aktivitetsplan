import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

interface MessageProps {
    tittel: string;
    undertekst?: string;
}

function Message(props: MessageProps) {
    const { tittel, undertekst } = props;
    if (undertekst) {
        return (
            <div>
                <Element>{tittel}</Element>
                <Normaltekst>{undertekst}</Normaltekst>
            </div>
        );
    }
    return <Element>{tittel}</Element>;
}

const melding_er = (antall: number) => (antall > 1 ? 'meldinger' : 'melding');

interface DialogLenkeInnholdProps {
    henvendelser: number;
    uleste: number;
    erVeileder: boolean;
    erStillingFraNav: boolean;
}

const DialogLenkeInnhold = (props: DialogLenkeInnholdProps) => {
    const { henvendelser, uleste, erVeileder, erStillingFraNav } = props;

    if (!henvendelser) {
        const tittel = !erVeileder && erStillingFraNav ? 'Spørsmål om stillingen?' : 'Send en melding om aktiviteten';
        const undertekst = erVeileder ?
            undefined :
            erStillingFraNav ? 'send en melding til veilederen din' : 'til veilederen din';
        return <Message tittel={tittel} undertekst={undertekst} />;
    }

    if (uleste) {
        const tittel = uleste === 1 ? '1 ulest melding' : `${uleste} uleste meldinger`;
        return <Message tittel={tittel} />;
    }

    return <Message tittel={`Se ${henvendelser} ${melding_er(henvendelser)} om aktiviteten`} />;
};

export default DialogLenkeInnhold;
