import { Button, InfoCard } from '@navikt/ds-react';
import React from 'react';

import { Lenke, OppgaveLenke } from '../../../../datatypes/eksternAktivitetTypes';
import { useErVeileder } from '../../../../Provider';

interface Props {
    oppgave?: OppgaveLenke;
}

const customAlertStripe = (lenke: Lenke) => (
    <InfoCard data-color="info">
        <InfoCard.Header>
            <InfoCard.Title>{lenke.tekst}</InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content className="flex flex-col">
            {lenke.subtekst}

            <Button variant={'primary'} as="a" href={lenke.url} className="flex w-fit mt-4">Gå videre</Button>
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
