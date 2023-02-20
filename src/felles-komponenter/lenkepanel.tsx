import { LinkPanel } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import hiddenIf from './hidden-if/hidden-if';

function Lenkepanel({ children, hidden, href }: { href: string; hidden: boolean; children: ReactNode }) {
    if (hidden) return null;
    return (
        <Link to={href}>
            <LinkPanel as="div">
                <LinkPanel.Title>{children}</LinkPanel.Title>
            </LinkPanel>
        </Link>
    );
}

export default hiddenIf(Lenkepanel);
