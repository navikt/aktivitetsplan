import Lenke from 'nav-frontend-lenker';
import React from 'react';

import DetaljFelt from './detalj-felt';

const httpRegex = /^(https?):\/\/.*$/;

interface Props {
    lenke?: string;
}

export default function DetaljvisningLenke(props: Props) {
    const lenke = props.lenke;
    if (!lenke || !lenke.trim()) {
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
            <Lenke
                target="_blank"
                href={lenke && lenke.match(httpRegex) ? lenke : `http://${lenke}`}
                className="detaljfelt__lenke"
            >
                {shortenedUrl} (åpnes i ny fane)
            </Lenke>
        </DetaljFelt>
    );
}
