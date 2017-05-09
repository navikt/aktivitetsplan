import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { erInternlenke } from '../../utils';
import visibleIfHOC from '../../hocs/visible-if';

const cls = (className, lenkeType, lenkestyling) => classNames(className, lenkeType, {
    lenke: lenkestyling
});

function Lenke({ href, className, brukLenkestyling, children, ...rest }) {
    if (erInternlenke(href)) {
        return (
            <Link {...rest} to={href} className={cls(className, 'internlenke', brukLenkestyling)}>{children}</Link>
        );
    }
    return (
        <a {...rest} href={href} className={cls(className, 'eksternlenke', brukLenkestyling)} >{children}</a>
    );
}

Lenke.defaultProps = {
    brukLenkestyling: true
};

Lenke.propTypes = {
    href: PT.string.isRequired,
    children: PT.node.isRequired,
    brukLenkestyling: PT.bool,
    className: PT.string
};

Lenke.defaultProps = {
    className: undefined
};

export default visibleIfHOC(Lenke);
