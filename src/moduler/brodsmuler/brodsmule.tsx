import React from 'react';
import Lenke from 'nav-frontend-lenker';

interface BrodsmuleTypes {
    path: string;
    tekst: string;
}

export default function Brodsmule(props: BrodsmuleTypes) {
    const { path, tekst } = props;
    const tekstEllerLink = path ? <Lenke href={path}>{`${tekst}`}</Lenke> : tekst;

    return <li className="brodsmuler__item typo-normal">{tekstEllerLink}</li>;
}
