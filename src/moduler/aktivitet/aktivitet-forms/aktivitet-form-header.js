import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import AktivitetIngress from '../visning/aktivitetingress/aktivitetingress';
import * as AppPT from '../../../proptypes';

function AktivitetFormHeader({ tittelId, ingressType, pakrevdInfoId }) {
    return (
        <div className="aktivitetskjema__header">
            <Innholdstittel className="skjema-header__tittel">
                <FormattedMessage id={tittelId} />
            </Innholdstittel>
            <AktivitetIngress
                type={ingressType}
                className="skjema-header__ingress"
            />
            <Undertekst className="skjema-header__pakrevd-info">
                <FormattedMessage id={pakrevdInfoId} />
            </Undertekst>
        </div>
    );
}

AktivitetFormHeader.propTypes = {
    tittelId: PT.string.isRequired,
    ingressType: AppPT.aktivitettype.isRequired,
    pakrevdInfoId: PT.string.isRequired,
};

export default AktivitetFormHeader;
