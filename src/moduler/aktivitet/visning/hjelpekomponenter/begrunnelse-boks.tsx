import { Alert, BodyShort } from '@navikt/ds-react';
import React from 'react';

interface Props {
    begrunnelse: string;
    className: string;
}

const BegrunnelseBoks = ({ begrunnelse, className }: Props) => {
    return (
        <div className={className}>
            <Alert variant="info">
                <BodyShort className="tilDittNavTekst">{begrunnelse}</BodyShort>
            </Alert>
        </div>
    );
};

export default BegrunnelseBoks;
