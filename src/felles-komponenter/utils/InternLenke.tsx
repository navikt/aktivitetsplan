import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { getFodselsnummer } from '../../utils/fnr-util';

const cls = (className?: string, brukLenkestyling?: boolean) =>
    classNames(className, {
        lenke: brukLenkestyling,
    });

interface InternLenkeProps {
    id?: string;
    href: string;
    className?: string;
    skipLenkeStyling?: boolean;
    children?: ReactNode;
    onClick?: () => void;
    role?: string;
    hidden?: boolean;
    disabled?: boolean;
}

function InternLenke(props: InternLenkeProps) {
    const { id, href, className, skipLenkeStyling, children, onClick, role, hidden } = props;
    const fodselsnummer = getFodselsnummer();
    const internHref = (fodselsnummer ? `/${fodselsnummer}` : '') + href;

    if (hidden) {
        return null;
    }

    return (
        <Link id={id} to={internHref} className={cls(className, !skipLenkeStyling)} onClick={onClick} role={role}>
            {children}
        </Link>
    );
}

export default InternLenke;
