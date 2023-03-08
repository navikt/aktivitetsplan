import { DialogDots } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';

const SendEnMeldingKnapp = () => (
    <Button variant="secondary" icon={<DialogDots aria-hidden />}>
        Send en melding
    </Button>
);

export default SendEnMeldingKnapp;
