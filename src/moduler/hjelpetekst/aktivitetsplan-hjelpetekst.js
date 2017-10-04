import React from 'react';
import PT from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {
    HjelpetekstVenstre,
    HjelpetekstHoyre,
    HjelpetekstOver,
    HjelpetekstUnder,
    HjelpetekstMidt,
    HjelpetekstAuto,
} from 'nav-frontend-hjelpetekst';

// Retninger
export const VENSTRE = 'venstre';
export const HOYRE = 'hoyre';
export const OVER = 'over';
export const UNDER = 'under';
export const MIDT = 'midt';
export const AUTO = 'auto';

const map = {
    [VENSTRE]: HjelpetekstVenstre,
    [HOYRE]: HjelpetekstHoyre,
    [OVER]: HjelpetekstOver,
    [UNDER]: HjelpetekstUnder,
    [MIDT]: HjelpetekstMidt,
    [AUTO]: HjelpetekstAuto,
};

function AktivitetsplanHjelpetekst({ tittelId, hjelpetekstId, retning, intl }) {
    const HjelpetekstFelles = map[retning];
    return (
        <HjelpetekstFelles tittel={intl.formatMessage({ id: tittelId })}>
            <FormattedMessage id={hjelpetekstId} />
        </HjelpetekstFelles>
    );
}

AktivitetsplanHjelpetekst.propTypes = {
    tittelId: PT.string.isRequired,
    hjelpetekstId: PT.string.isRequired,
    retning: PT.oneOf(Object.keys(map)).isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(AktivitetsplanHjelpetekst);
