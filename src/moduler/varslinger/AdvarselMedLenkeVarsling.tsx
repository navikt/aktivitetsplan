import { Alert, Link } from '@navikt/ds-react';
import React from 'react';

interface Props {
    tekst: string;
    lenkeTekst: string;
    href: string;
    hidden?: boolean;
}

const AdvarselMedLenkeVarsling = (props: Props) => {
    const { hidden, tekst, lenkeTekst, href } = props;

    if (hidden) {
        return null;
    }

    return (
        <Alert variant="warning" className="mb-5 mt-4">
            {tekst}
            &nbsp;
            <Link href={href}>{lenkeTekst}</Link>
        </Alert>
    );
};

export default AdvarselMedLenkeVarsling;
