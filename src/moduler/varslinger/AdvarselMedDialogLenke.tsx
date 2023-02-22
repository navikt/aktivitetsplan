import { Alert, BodyShort } from '@navikt/ds-react';
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
            <BodyShort>
                {tekst}
                &nbsp;
                <LenkeTilDialog dialogId={dialogId} onClick={onClick}>
                    {lenkeTekst}
                </LenkeTilDialog>
            </BodyShort>
        </Alert>
    );
};

export default AdvarselMedDialogLenke;
