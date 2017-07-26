import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { erInternlenke } from '../../utils';
import visibleIfHOC from '../../hocs/visible-if';

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
    ...rest
}) {
    if (erInternlenke(href)) {
        return (
            <Link
                {...rest}
                to={href}
                className={cls(className, 'internlenke', brukLenkestyling)}
                ref={focusRef}
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
};

Lenke.defaultProps = {
    className: undefined,
    focusRef: () => {},
    brukLenkestyling: true,
};

export default visibleIfHOC(Lenke);
