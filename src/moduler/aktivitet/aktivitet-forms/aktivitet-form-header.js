import React from 'react';
import PT from 'prop-types';
import { Sidetittel, Undertekst } from 'nav-frontend-typografi';
import AktivitetIngress from '../visning/aktivitetingress/aktivitetingress';
import * as AppPT from '../../../proptypes';

function AktivitetFormHeader({ tittel, ingressType }) {
    return (
        <div className="aktivitetskjema__header">
            <Sidetittel className="skjema-header__tittel">
                {tittel}
            </Sidetittel>
            <AktivitetIngress
                type={ingressType}
                className="skjema-header__ingress"
            />
            <Undertekst className="skjema-header__pakrevd-info">
                * må fylles ut
            </Undertekst>
        </div>
    );
}

AktivitetFormHeader.propTypes = {
    tittel: PT.string.isRequired,
    ingressType: AppPT.aktivitettype.isRequired,
};

export default AktivitetFormHeader;
