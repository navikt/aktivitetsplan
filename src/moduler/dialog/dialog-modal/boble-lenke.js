import React from 'react';
import Lenke from 'nav-frontend-lenker';
import * as PT from 'prop-types';

const httpRegex = /^(https?):\/\/.*$/;

const lenkenavnMap = {
    'https://behovsvurdering.nav.no': 'behovsvurdering',
    'https://forberede-moete.nav.no': 'møtestøtte',
};

// basert på nav-frontend-tekstomrade/src/fragments.tsx, justert som midlertidig fiks på FO-2010
function BobleLenke({ href, dialogId }) {
    if (!href || href.length === 0) {
        return null;
    }
    const lenkeTekst = lenkenavnMap[href] ? lenkenavnMap[href] : href;
    const lenkeMedParams = lenkenavnMap[href]
        ? `${href}?dialogId=${dialogId}`
        : href;

    const matched = lenkeMedParams.match(httpRegex)
        ? lenkeMedParams
        : `http://${lenkeMedParams}`;

    return (
        <Lenke href={matched}>
            {lenkeTekst}
        </Lenke>
    );
}

BobleLenke.propTypes = {
    href: PT.string,
    dialogId: PT.string,
};

BobleLenke.defaultProps = {
    href: '',
    dialogId: '',
};

export default BobleLenke;
