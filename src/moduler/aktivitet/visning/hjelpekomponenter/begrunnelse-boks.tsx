import { Alert, BodyShort } from '@navikt/ds-react';
import React from 'react';

interface Props {
    begrunnelse: string;
}

const BegrunnelseBoks = ({ begrunnelse }: Props) => {
    return (
        <Alert variant="info">
            <BodyShort className="tilDittNavTekst">{begrunnelse}</BodyShort>
        </Alert>
    );
};

export default BegrunnelseBoks;
