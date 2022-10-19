import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

interface Props {
    begrunnelse: string;
    className: string;
}

const BegrunnelseBoks = ({ begrunnelse, className }: Props) => {
    return (
        <div className={className}>
            <AlertStripeInfo>
                <Normaltekst className="tilDittNavTekst">{begrunnelse}</Normaltekst>
            </AlertStripeInfo>
        </div>
    );
};

export default BegrunnelseBoks;
