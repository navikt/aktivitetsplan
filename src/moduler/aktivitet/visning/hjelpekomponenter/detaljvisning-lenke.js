import Lenke from 'nav-frontend-lenker';
import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import DetaljFelt from './detalj-felt';

const httpRegex = /^(https?):\/\/.*$/;

export default function DetaljvisningLenke({ lenke }) {
    if (!lenke || !lenke.trim()) {
        return null;
    }

    const shortenedUrl = new URL(lenke.startsWith('http') ? lenke : 'http://' + lenke);

    return (
        <DetaljFelt
            key="lenke"
            tittel={<FormattedMessage id="aktivitetdetaljer.lenke-label" />}
            visible={true}
            fullbredde
        >
            <Lenke
                target="_blank"
                href={lenke && lenke.match(httpRegex) ? lenke : `http://${lenke}`}
                className="detaljfelt__lenke"
            >
                {shortenedUrl.hostname} (åpnes i ny fane)
            </Lenke>
        </DetaljFelt>
    );
}

DetaljvisningLenke.propTypes = {
    lenke: PT.string,
};
DetaljvisningLenke.defaultProps = {
    lenke: null,
};
