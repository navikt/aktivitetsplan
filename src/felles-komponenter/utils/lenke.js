import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { erInternlenke } from '../../utils';
import { visibleIfHOC } from '../../hocs/visible-if';

const cls = (className, lenkeType) => classNames(className, lenkeType, 'lenke');

function Lenke({ href, className, children, ...rest }) {
    if (erInternlenke(href)) {
        return (
            <Link {...rest} to={href} className={cls(className, 'internlenke')}>{children}</Link>
        );
    }
    return (
        <a {...rest} href={href} className={cls(className, 'eksternlenke')} >{children}</a>
    );
}

Lenke.propTypes = {
    href: PT.string.isRequired,
    children: PT.node.isRequired,
    className: PT.string
};

export default visibleIfHOC(Lenke);
