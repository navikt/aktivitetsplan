import { Link } from '@navikt/ds-react';
import React from 'react';

import DetaljFelt from './DetaljFelt';

const httpRegex = /^(https?):\/\/.*$/;

const formatterLenke = (lenke: string) => {
    const nyLenke = lenke?.trim();
    return nyLenke && nyLenke.match(httpRegex) ? nyLenke : `http://${lenke}`;
};

interface Props {
    lenke?: string;
}

const DetaljvisningLenke = (props: Props) => {
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
            <Link target="_blank" href={formatterLenke(lenke)} className="block">
                {shortenedUrl} (åpnes i ny fane)
            </Link>
        </DetaljFelt>
    );
};

export default DetaljvisningLenke;
