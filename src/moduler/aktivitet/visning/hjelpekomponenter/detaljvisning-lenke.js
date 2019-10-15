import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import React from 'react';
import DetaljFelt from './detalj-felt';
import EksternLenkeIkon from '../../../../felles-komponenter/utils/ekstern-lenke-ikon';
import Lenke from 'nav-frontend-lenker';

const httpRegex = /^(https?):\/\/.*$/;

export default function DetaljvisningLenke({ lenke }) {
    return (
        <DetaljFelt
            key="lenke"
            tittel={<FormattedMessage id="aktivitetdetaljer.lenke-label" />}
            visible={!!(lenke && lenke.trim())}
            fullbredde
        >
            <Lenke href={lenke && lenke.match(httpRegex) ? lenke : `http://${lenke}`} className="detaljfelt__lenke">
                {lenke}
                <EksternLenkeIkon />
            </Lenke>
        </DetaljFelt>
    );
}

DetaljvisningLenke.propTypes = {
    lenke: PT.string
};
DetaljvisningLenke.defaultProps = {
    lenke: null
};
