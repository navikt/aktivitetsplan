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
    const { href, disabled, type, onClick, children } = props;
    const lenkeknappClassNames = `knapp knapp--${type}`;
    if (disabled) {
        return <Knapp onClick={onClick} className={lenkeknappClassNames} disabled children={children} />;
    }

    return (
        <InternLenke
            role="button"
            onClick={onClick}
            className={lenkeknappClassNames}
            href={href}
            children={children}
            skipLenkeStyling
        />
    );
}
