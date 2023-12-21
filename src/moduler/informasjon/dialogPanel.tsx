import { Accordion, BodyShort, Heading } from '@navikt/ds-react';
import React from 'react';
import DialogVideo from './Video/DialogVideo';
import { logAccordionAapnet } from '../../amplitude/amplitude';

export const DialogPanel = () => {
    return (
        <Accordion.Item>
            <Accordion.Header onClick={() => logAccordionAapnet('Dialog med veilederen din')}>
                <Heading level="2" size="small">
                    Dialog med veilederen din
                </Heading>
            </Accordion.Header>
            <Accordion.Content>
                <BodyShort>
                    I dialogen kan du og veilederen din skrive til hverandre om arbeid og oppfølging. Dere kan blant
                    annet sende meldinger om aktivitetene dine i aktivitetsplanen.
                </BodyShort>
                <DialogVideo />
            </Accordion.Content>
        </Accordion.Item>
    );
};
