import { Accordion, BodyShort, Heading } from '@navikt/ds-react';
import React, { useState } from 'react';
import { logAccordionAapnet } from '../../analytics/umami';

export const InnsynsrettPanel = () => {
    const [open, setOpen] = useState(false);

    function handleClick() {
        if (!open) {
            logAccordionAapnet('Er du under 18 år?');
        }
        setOpen(!open);
    }

    return (
        <Accordion.Item>
            <Accordion.Header onClick={handleClick}>
                <Heading level="2" size="small">
                    Er du under 18 år?
                </Heading>
            </Accordion.Header>
            <Accordion.Content>
                <Heading level="3" size="xsmall" className="pt-4">
                    Er du under 18 år?
                </Heading>
                <BodyShort className="pb-4">
                    Når du er under 18 år så har dine foresatte rett til å be om å få se alt du skriver i Nav sine
                    tjenester. Derfor bør du ikke skrive noe her som du ikke vil at dine foresatte skal lese.
                </BodyShort>

                <BodyShort>
                    Når du blir 18 år vil de ikke kunne lese nye ting du skriver, men de kan fortsatt lese det du skrev
                    før du fylte 18 år.
                </BodyShort>
            </Accordion.Content>
        </Accordion.Item>
    );
};
