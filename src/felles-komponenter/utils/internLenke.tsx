import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { getFodselsnummer } from '../../bootstrap/fnr-util';

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
}

const InternLenke = React.forwardRef<HTMLAnchorElement, InternLenkeProps>((props, ref) => {
    const { id, href, className, skipLenkeStyling, children, onClick, role, hidden } = props;
    const fodselsnummer = getFodselsnummer();
    const internHref = (fodselsnummer ? `/${fodselsnummer}` : '') + href;

    if (hidden) {
        return null;
    }

    return (
        <Link
            ref={ref}
            id={id}
            to={internHref}
            className={cls(className, !skipLenkeStyling)}
            onClick={onClick}
            role={role}
        >
            {children}
        </Link>
    );
});

export default InternLenke;
