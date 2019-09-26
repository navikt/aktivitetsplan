import React from 'react';
import Lenke from 'nav-frontend-lenker';

export default function Brodsmule(props: { path: string; tekst: string }) {
    const tekstEllerLink = props.path ? <Lenke href={props.path}>{`${props.tekst}`}</Lenke> : props.tekst;

    return <li className="brodsmuler__item typo-normal">{tekstEllerLink}</li>;
}
