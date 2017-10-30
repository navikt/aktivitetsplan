import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { erInternlenke } from '../../utils';
import visibleIfHOC from '../../hocs/visible-if';
import { getFodselsnummer } from '../../bootstrap/fnr-util';

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
    onClick,
    ...rest
}) {
    if (erInternlenke(href)) {
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
        <a
            {...rest}
            href={href}
            className={cls(className, 'eksternlenke', brukLenkestyling)}
            ref={focusRef}
        >
            {children}
        </a>
    );
}

Lenke.propTypes = {
    href: PT.string.isRequired,
    children: PT.node.isRequired,
    brukLenkestyling: PT.bool,
    className: PT.string,
    focusRef: PT.func,
    onClick: PT.func,
};

Lenke.defaultProps = {
    className: undefined,
    focusRef: () => {},
    onClick: () => {},
    brukLenkestyling: true,
};

export default visibleIfHOC(Lenke);
