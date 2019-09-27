import React, { ReactNode } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import InternLenke from './internLenke';

interface LenkeknappProps {
    href: string;
    disabled: boolean;
    type: string;
    onClick: () => void;
    children: ReactNode;
}

export default function Lenkeknapp(props: LenkeknappProps) {
    const lenkeknappClassNames = `knapp knapp--${props.type}`;
    if (props.disabled) {
        return <Knapp onClick={props.onClick} className={lenkeknappClassNames} disabled children={props.children} />;
    }

    return (
        <InternLenke
            role="button"
            onClick={props.onClick}
            className={lenkeknappClassNames}
            href={props.href}
            children={props.children}
            skipLenkeStyling
        />
    );
}
