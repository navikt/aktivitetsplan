import React from 'react';
import PT from 'prop-types';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import visibleIfHOC from '../../../../hocs/visible-if';

function BegrunnelseBoks({ begrunnelse, className }) {
    return (
        <div className={className}>
            <AlertStripeInfo>
                <Normaltekst className="tilDittNavTekst">{begrunnelse}</Normaltekst>
            </AlertStripeInfo>
        </div>
    );
}

BegrunnelseBoks.defaultProps = {
    className: '',
};

BegrunnelseBoks.propTypes = {
    begrunnelse: PT.string.isRequired,
    className: PT.string,
};

export default visibleIfHOC(BegrunnelseBoks);
