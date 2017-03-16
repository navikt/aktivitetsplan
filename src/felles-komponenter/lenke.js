import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { erInternlenke } from './../utils';

const cls = (className, lenkeType) => classNames(className, lenkeType, 'lenke');

function Lenke({ href, className, children }) {
    if (erInternlenke(href)) {
        return (
            <Link to={href} className={cls(className, 'internlenke')}>{children}</Link>
        );
    }
    return (
        <a href={href} className={cls(className, 'eksternlenke')} >{children}</a>
    );
}

Lenke.propTypes = {
    href: PT.string.isRequired,
    children: PT.node.isRequired,
    className: PT.string
};

export default Lenke;
