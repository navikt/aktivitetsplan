import { Alert, BodyShort } from '@navikt/ds-react';
import React from 'react';

import LenkeTilDialog from '../dialog/DialogLink';

interface Props {
    lenkeTekst: string;
    tekst: string;
    hidden?: boolean;
    dialogId?: string;
}

const AdvarselMedDialogLenke = (props: Props) => {
    const { lenkeTekst, tekst, hidden, dialogId } = props;

    if (hidden) {
        return null;
    }

    return (
        <Alert variant="warning" className="mb-5 mt-4">
            <BodyShort>
                {tekst}
                &nbsp;
                <LenkeTilDialog dialogId={dialogId}>{lenkeTekst}</LenkeTilDialog>
            </BodyShort>
        </Alert>
    );
};

export default AdvarselMedDialogLenke;
