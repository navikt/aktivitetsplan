import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import React from 'react';
import DetaljFelt from './detalj-felt';
import Lenke from '../../../../felles-komponenter/utils/lenke';

const httpRegex = /^(https?):\/\/.*$/;

export default function LenkeKomponent({ lenke }) {
    return (
        <DetaljFelt
            key="lenke"
            tittel={<FormattedMessage id="aktivitetdetaljer.lenke-label" />}
            visible={lenke != null}
            fullbredde
        >
            <Lenke
                href={
                    lenke && lenke.match(httpRegex) ? lenke : `http://${lenke}`
                }
                className="detaljfelt__lenke"
                target="_blank"
            >
                {lenke}
            </Lenke>
        </DetaljFelt>
    );
}

LenkeKomponent.propTypes = {
    lenke: PT.string,
};
LenkeKomponent.defaultProps = {
    lenke: null,
};
