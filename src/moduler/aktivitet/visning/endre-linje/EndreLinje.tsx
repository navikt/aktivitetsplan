import { Accordion, Heading } from '@navikt/ds-react';
import React, { MouseEventHandler, ReactNode } from 'react';

interface Props {
    tittel: string;
    content: ReactNode;
    subtittel: ReactNode;
    open: boolean;
    onClick: MouseEventHandler;
    icon: ReactNode;
}

const EndreLinje = (props: Props) => {
    const { tittel, content, subtittel, open, onClick, icon } = props;

    return (
        <>
            <Accordion.Item open={open} className="first:border-t-2 first:border-border-divider">
                <Accordion.Header onClick={onClick} className="items-center">
                    <div className="flex flex-row gap-4 items-center">
                        {icon}
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
