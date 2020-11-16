import classNames from 'classnames';
import { Knapp } from 'nav-frontend-knapper';
import React, { ReactNode } from 'react';

import visibleIfHOC from '../../hocs/visible-if';
import InternLenke from './InternLenke';

interface LenkeknappProps {
    href: string;
    disabled: boolean;
    type: string;
    onClick: () => void;
    className?: string;
    children: ReactNode;
}

function Lenkeknapp(props: LenkeknappProps) {
    const { href, disabled, type, onClick, className, children } = props;
    const lenkeknappClassNames = classNames(`knapp knapp--${type}`, className);
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

export default visibleIfHOC(Lenkeknapp);
