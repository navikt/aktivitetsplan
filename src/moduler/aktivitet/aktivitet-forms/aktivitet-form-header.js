import { BodyShort, Heading } from '@navikt/ds-react';
import PT from 'prop-types';
import React from 'react';

import * as AppPT from '../../../proptypes';
import AktivitetIngress from '../visning/aktivitetingress/AktivitetIngress';

function AktivitetFormHeader({ tittel, aktivitetsType }) {
    return (
        <div className="aktivitetskjema__header">
            <Heading level="1" size="xlarge" className="skjema-header__tittel">
                {tittel}
            </Heading>
            <AktivitetIngress aktivitetstype={aktivitetsType} />
            <BodyShort className="skjema-header__pakrevd-info">* må fylles ut</BodyShort>
        </div>
    );
}

AktivitetFormHeader.propTypes = {
    tittel: PT.string.isRequired,
    aktivitetsType: AppPT.aktivitettype.isRequired,
};

export default AktivitetFormHeader;
