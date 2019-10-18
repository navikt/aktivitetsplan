import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { getFodselsnummer } from '../../bootstrap/fnr-util';

const cls = (className, brukLenkestyling) =>
    classNames(className, {
        lenke: brukLenkestyling
    });

interface InternLenkeProps {
    href: string;
    className?: string;
    skipLenkeStyling?: boolean;
    children?: ReactNode;
    onClick?: () => void;
    role?: string;
    hidden?: boolean;
}

export default function InternLenke(props: InternLenkeProps) {
    const { href, className, skipLenkeStyling, children, onClick, role, hidden } = props;
    const fodselsnummer = getFodselsnummer();
    const internHref = (fodselsnummer ? `/${fodselsnummer}` : '') + href;

    if (hidden) {
        return null;
    }

    return (
        <Link to={internHref} className={cls(className, !skipLenkeStyling)} onClick={onClick} role={role}>
            {children}
        </Link>
    );
}
