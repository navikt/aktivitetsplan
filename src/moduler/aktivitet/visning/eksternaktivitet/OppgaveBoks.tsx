import { Alert, Button, Heading, InfoCard } from '@navikt/ds-react';
import React from 'react';

import { Oppgave, OppgaveLenke } from '../../../../datatypes/eksternAktivitetTypes';
import { useErVeileder } from '../../../../Provider';

interface Props {
    oppgave?: OppgaveLenke;
}

const customAlertStripe = (oppgave: Oppgave) => (
    <InfoCard data-color="info">
        <InfoCard.Header>
            <InfoCard.Title>
                {oppgave.tekst}
            </InfoCard.Title>
        </InfoCard.Header>
       <InfoCard.Content className="flex flex-col">
        {oppgave.subtekst}

        <Button variant={'primary'} as="a" href={oppgave.url} className="flex w-fit mt-4">
            {oppgave.knapptekst || 'Gå videre'}
        </Button>
       </InfoCard.Content>
    </InfoCard>
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
