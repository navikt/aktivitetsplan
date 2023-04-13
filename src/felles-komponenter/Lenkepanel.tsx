import { LinkPanel } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
    children: ReactNode;
    href: string;
}

const Lenkepanel = ({ children, href }: Props) => {
    return (
        <Link to={href}>
            <LinkPanel as="div">
                <LinkPanel.Title>{children}</LinkPanel.Title>
            </LinkPanel>
        </Link>
    );
};

export default Lenkepanel;
