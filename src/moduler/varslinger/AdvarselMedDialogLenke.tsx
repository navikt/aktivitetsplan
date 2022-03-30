import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import LenkeTilDialog from '../dialog/DialogLink';

interface Props {
    lenkeTekst: string;
    tekst: string;
    hidden?: boolean;
    dialogId?: string;
    className: string;
    onClick?: () => void;
}

const AdvarselMedDialogLenke = (props: Props) => {
    const { lenkeTekst, tekst, hidden, dialogId, className, onClick } = props;

    if (hidden) {
        return null;
    }

    return (
        <AlertStripeAdvarsel className={className}>
            <Normaltekst>{tekst}</Normaltekst>
            &nbsp;
            <LenkeTilDialog dialogId={dialogId} onClick={onClick}>
                {lenkeTekst}
            </LenkeTilDialog>
        </AlertStripeAdvarsel>
    );
};

export default AdvarselMedDialogLenke;
