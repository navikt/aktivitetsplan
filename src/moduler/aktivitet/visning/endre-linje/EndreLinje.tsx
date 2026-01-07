import { Accordion, Heading } from '@navikt/ds-react';
import React, { MouseEventHandler, ReactNode, useState } from 'react';
import { logAccordionAapnet } from '../../../../analytics/analytics';

interface Props {
    tittel: string;
    content: ReactNode;
    subtittel: ReactNode;
    open: boolean;
    onClick: MouseEventHandler;
    icon: ReactNode;
}

const EndreLinje = (props: Props) => {
    const { tittel, content, subtittel, open, onClick } = props;

    const [openAccordion, setOpenAccordion] = useState(false);

    function handleClick(event: React.MouseEvent) {
        onClick(event);

        if (!openAccordion) {
            logAccordionAapnet(tittel);
        }
        setOpenAccordion(!openAccordion);
    }

    return (
        <>
            <Accordion.Item open={open}>
                <Accordion.Header onClick={handleClick} className="items-center">
                    <div className="flex flex-row gap-4 items-center">
                        <div>
                            <Heading size="small" level="2">
                                {tittel}
                            </Heading>
                            <div>{subtittel}</div>
                        </div>
                    </div>
                </Accordion.Header>
                <Accordion.Content>{content}</Accordion.Content>
            </Accordion.Item>
        </>
    );
};

export default EndreLinje;
