import { Sidetittel, Undertekst } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React from 'react';

import * as AppPT from '../../../proptypes';
import AktivitetIngress from '../visning/aktivitetingress/AktivitetIngress';

function AktivitetFormHeader({ tittel, aktivitetsType }) {
    return (
        <div className="aktivitetskjema__header">
            <Sidetittel className="skjema-header__tittel">{tittel}</Sidetittel>
            <AktivitetIngress aktivitetstype={aktivitetsType} />
            <Undertekst className="skjema-header__pakrevd-info">* må fylles ut</Undertekst>
        </div>
    );
}

AktivitetFormHeader.propTypes = {
    tittel: PT.string.isRequired,
    aktivitetsType: AppPT.aktivitettype.isRequired,
};

export default AktivitetFormHeader;
