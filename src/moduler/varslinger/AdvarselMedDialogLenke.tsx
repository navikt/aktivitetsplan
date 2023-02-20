import { Alert } from '@navikt/ds-react';
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
        <Alert variant="warning" className={className}>
            <Normaltekst>
                {tekst}
                &nbsp;
                <LenkeTilDialog dialogId={dialogId} onClick={onClick}>
                    {lenkeTekst}
                </LenkeTilDialog>
            </Normaltekst>
        </Alert>
    );
};

export default AdvarselMedDialogLenke;
