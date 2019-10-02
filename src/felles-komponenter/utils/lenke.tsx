import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { erInternlenke } from '../../utils';
import visibleIfHOC from '../../hocs/visible-if';
import { getFodselsnummer } from '../../bootstrap/fnr-util';

const cls = (className?: string, lenkeType?: string, lenkestyling?: boolean) =>
    classNames(className, lenkeType, {
        lenke: lenkestyling
    });

interface Props {
    href: string;
    children: React.ReactNode;
    className?: string;
    brukLenkestyling?: boolean;
    focusRef?: () => void;
    erEksternLenke?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

function Lenke(props: Props) {
    const { href, className, brukLenkestyling, children, focusRef, erEksternLenke, onClick, disabled, ...rest } = props;

    if (disabled) {
        return <div className={cls(className, undefined, false)}>{children}</div>;
    }

    if (erInternlenke(href) && !erEksternLenke) {
        const fodselsnummer = getFodselsnummer();
        const internHref = (fodselsnummer ? `/${fodselsnummer}` : '') + href;

        return (
            <Link
                {...rest}
                to={internHref}
                className={cls(className, 'internlenke', brukLenkestyling)}
                ref={focusRef}
                onClick={onClick}
            >
                {children}
            </Link>
        );
    }

    return (
        <span>
            <a {...rest} href={href} className={cls(className, 'eksternlenke', brukLenkestyling)} ref={focusRef}>
                {children}
            </a>
        </span>
    );
}

Lenke.defaultProps = {
    className: undefined,
    focusRef: () => {},
    onClick: () => {},
    brukLenkestyling: true,
    disabled: false,
    erEksternLenke: false
};

export default visibleIfHOC(Lenke);
