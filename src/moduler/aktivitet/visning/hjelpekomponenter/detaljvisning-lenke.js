import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import React from 'react';
import DetaljFelt from './detalj-felt';
import InternLenke from '../../../../felles-komponenter/utils/internLenke';
import EksternLenkeIkon from '../../../../felles-komponenter/utils/ekstern-lenke-ikon';

const httpRegex = /^(https?):\/\/.*$/;

export default function DetaljvisningLenke({ lenke }) {
    return (
        <DetaljFelt
            key="lenke"
            tittel={<FormattedMessage id="aktivitetdetaljer.lenke-label" />}
            visible={!!(lenke && lenke.trim())}
            fullbredde
        >
            <InternLenke
                href={lenke && lenke.match(httpRegex) ? lenke : `http://${lenke}`}
                className="detaljfelt__lenke"
            >
                {lenke}
                <EksternLenkeIkon />
            </InternLenke>
        </DetaljFelt>
    );
}

DetaljvisningLenke.propTypes = {
    lenke: PT.string
};
DetaljvisningLenke.defaultProps = {
    lenke: null
};
