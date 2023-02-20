import { Alert } from '@navikt/ds-react';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

interface Props {
    begrunnelse: string;
    className: string;
}

const BegrunnelseBoks = ({ begrunnelse, className }: Props) => {
    return (
        <div className={className}>
            <Alert variant="info">
                <Normaltekst className="tilDittNavTekst">{begrunnelse}</Normaltekst>
            </Alert>
        </div>
    );
};

export default BegrunnelseBoks;
