import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { erInternlenke } from '../../utils';
import visibleIfHOC from '../../hocs/visible-if';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import EksternLenkeIkon from './ekstern-lenke-ikon';

const cls = (className, lenkeType, lenkestyling) =>
    classNames(className, lenkeType, {
        lenke: lenkestyling,
    });

function Lenke({
    href,
    className,
    brukLenkestyling,
    children,
    focusRef,
    erEksternLenke,
    onClick,
    disabled,
    ...rest
}) {
    if (disabled) {
        return (
            <div className={cls(className, null, false)}>
                {children}
            </div>
        );
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
            <a
                {...rest}
                href={href}
                className={cls(className, 'eksternlenke', brukLenkestyling)}
                ref={focusRef}
            >
                {children}
            </a>
            <span className="eksternlenkeIkonBoks">
                <EksternLenkeIkon />
            </span>
        </span>
    );
}

Lenke.propTypes = {
    href: PT.string.isRequired,
    children: PT.node.isRequired,
    brukLenkestyling: PT.bool,
    className: PT.string,
    focusRef: PT.func,
    erEksternLenke: PT.bool,
    onClick: PT.func,
    disabled: PT.bool,
};

Lenke.defaultProps = {
    className: undefined,
    focusRef: () => {},
    onClick: () => {},
    brukLenkestyling: true,
    disabled: false,
    erEksternLenke: false,
};

export default visibleIfHOC(Lenke);
