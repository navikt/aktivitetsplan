import Lenke from 'nav-frontend-lenker';
import PT from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import EksternLenkeIkon from '../../../../felles-komponenter/utils/ekstern-lenke-ikon';
import DetaljFelt from './detalj-felt';

const httpRegex = /^(https?):\/\/.*$/;

export default function DetaljvisningLenke({ lenke }) {
    return (
        <DetaljFelt
            key="lenke"
            tittel={<FormattedMessage id="aktivitetdetaljer.lenke-label" />}
            visible={!!(lenke && lenke.trim())}
            fullbredde
        >
            <Lenke
                target="_blank"
                href={lenke && lenke.match(httpRegex) ? lenke : `http://${lenke}`}
                className="detaljfelt__lenke"
            >
                {lenke}
                <EksternLenkeIkon />
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
