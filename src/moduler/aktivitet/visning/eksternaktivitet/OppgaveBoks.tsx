import { Alert, Button, Heading } from '@navikt/ds-react';
import React from 'react';

import { Oppgave, OppgaveLenke } from '../../../../datatypes/eksternAktivitetTypes';
import { useErVeileder } from '../../../../Provider';

interface Props {
    oppgave?: OppgaveLenke;
}

const customAlertStripe = (oppgave: Oppgave) => (
    <Alert variant="warning">
        <Heading spacing size="small" level="3">
            {oppgave.tekst}
        </Heading>
        {oppgave.subtekst}

        <Button variant={'primary'} as="a" href={oppgave.url} className="flex w-fit mt-4">
            {oppgave.knapptekst}
        </Button>
    </Alert>
);

const OppgaveBoks = ({ oppgave }: Props) => {
    const erVeileder = useErVeileder();

    if (!oppgave) return null;

    if (erVeileder && oppgave.intern) {
        return customAlertStripe(oppgave.intern);
    }

    if (!erVeileder && oppgave.ekstern) {
        return customAlertStripe(oppgave.ekstern);
    }

    return null;
};

export default OppgaveBoks;
