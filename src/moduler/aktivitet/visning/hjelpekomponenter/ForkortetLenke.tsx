import Lenke from 'nav-frontend-lenker';
import React from 'react';

import { formatterLenke } from '../../../../utils/formatterLenke';

interface Props {
    lenke?: string;
}

export default function ForkortetLenke(props: Props) {
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
        <Lenke target="_blank" href={formatterLenke(lenke)} className="detaljfelt__lenke">
            {shortenedUrl} (åpnes i ny fane)
        </Lenke>
    );
}
