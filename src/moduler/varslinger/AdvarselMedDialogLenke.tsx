import { Alert, BodyShort } from '@navikt/ds-react';
import React from 'react';

import LenkeTilDialog from '../dialog/DialogLink';

interface Props {
    lenkeTekst: string;
    tekst: string;
    hidden?: boolean;
    dialogId?: string;
    className: string;
}

const AdvarselMedDialogLenke = (props: Props) => {
    const { lenkeTekst, tekst, hidden, dialogId, className } = props;

    if (hidden) {
        return null;
    }

    return (
        <Alert variant="warning" className={className}>
            <BodyShort>
                {tekst}
                &nbsp;
                <LenkeTilDialog dialogId={dialogId}>{lenkeTekst}</LenkeTilDialog>
            </BodyShort>
        </Alert>
    );
};

export default AdvarselMedDialogLenke;
