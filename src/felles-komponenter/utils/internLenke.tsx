import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { getFodselsnummer } from '../../bootstrap/fnr-util';

const cls = (className?: string, brukLenkestyling?: boolean) =>
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
}

export default function InternLenke(props: InternLenkeProps) {
    const { href, className, skipLenkeStyling, children, onClick, role } = props;
    const fodselsnummer = getFodselsnummer();
    const internHref = (fodselsnummer ? `/${fodselsnummer}` : '') + href;

    return (
        <Link to={internHref} className={cls(className, !skipLenkeStyling)} onClick={onClick} role={role}>
            {children}
        </Link>
    );
}
