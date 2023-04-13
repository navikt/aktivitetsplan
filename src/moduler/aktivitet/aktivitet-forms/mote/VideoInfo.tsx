import { BodyShort, Link } from '@navikt/ds-react';
import React from 'react';

import { Kanal } from '../../../../datatypes/aktivitetTypes';
import EksternLenkeIkon from '../../../../felles-komponenter/utils/EksternLenkeIkon';

const VideoInfo = ({ kanal }: { kanal: Kanal }) => {
    if (kanal === Kanal.INTERNET) {
        return (
            <BodyShort className="mote-aktivitet-form__video-info">
                Les om{' '}
                <Link
                    href="https://navno.sharepoint.com/sites/intranett-it/SitePages/Videom%C3%B8te-med-brukere.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    rutiner for videomøte her <EksternLenkeIkon />
                </Link>
            </BodyShort>
        );
    }
    return null;
};

export default VideoInfo;
