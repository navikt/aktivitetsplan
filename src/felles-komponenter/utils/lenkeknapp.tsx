import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Knapp } from 'nav-frontend-knapper';
import InternLenke from './internLenke';

interface LenkeknappProps {
    href: string;
    className: string;
    disabled: boolean;
    type: string;
    onClick: () => void;
    children: ReactNode;
}

export default function Lenkeknapp(props: LenkeknappProps) {
    const lenkeknappClassNames = classNames('lenkeknapp', props.type && `lenkeknapp--${props.type}`, props.className);
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
        />
    );
}
