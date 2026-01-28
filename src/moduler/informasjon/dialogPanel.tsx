import { Accordion, BodyShort, Heading } from '@navikt/ds-react';
import React, { useState } from 'react';
import DialogVideo from './Video/DialogVideo';
import { logAccordionAapnet } from '../../analytics/analytics';

export const DialogPanel = () => {
    const [open, setOpen] = useState(false);

    function handleClick() {
        if (!open) {
            logAccordionAapnet('Dialog med veilederen din');
        }
        setOpen(!open);
    }

    return (
        <Accordion.Item>
            <Accordion.Header onClick={handleClick}>
                <Heading level="2" size="small">
                    Dialog med veilederen din
                </Heading>
            </Accordion.Header>
            <Accordion.Content>
                <BodyShort className="pb-4">
                    I dialogen kan du og veilederen din skrive til hverandre om arbeid og oppfølging. Dere kan blant
                    annet sende meldinger om aktivitetene dine i aktivitetsplanen.
                </BodyShort>
                <BodyShort>
                    Vær oppmerksom på at hverken du eller veilederen din kan endre meldinger etter at de er sendt. Hvis
                    det er noe du ønsker å rette på, kan du sende en ny melding der du forteller om hva som ikke stemte
                    i den forrige meldingen.
                </BodyShort>
                <DialogVideo />
            </Accordion.Content>
        </Accordion.Item>
    );
};
