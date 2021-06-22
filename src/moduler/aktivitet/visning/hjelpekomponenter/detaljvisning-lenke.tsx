import Lenke from 'nav-frontend-lenker';
import React from 'react';

import { formatterLenke } from '../../../../utils/formatterLenke';
import DetaljFelt from './detalj-felt';

interface Props {
    lenke?: string;
}

export default function DetaljvisningLenke(props: Props) {
    const lenke = props.lenke?.trim();
    if (!lenke) {
        return null;
    }
    let shortenedUrl;
    try {
        shortenedUrl = new URL(lenke.startsWith('http') ? lenke : 'http://' + lenke).hostname;
    } catch (e) {
        shortenedUrl = lenke;
    }

    return (
        <DetaljFelt key="lenke" tittel="Lenke" fullbredde>
            <Lenke target="_blank" href={formatterLenke(lenke)} className="detaljfelt__lenke">
                {shortenedUrl} (åpnes i ny fane)
            </Lenke>
        </DetaljFelt>
    );
}
