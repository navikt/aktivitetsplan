import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import Lenke from './lenke';
import './lenkeknapp.less';

function Lenkeknapp({ href, className, ...rest }) {
    return (
        <Lenke
            {...rest}
            role="button"
            className={classNames('lenkeknapp', className)}
            href={href}
        />
    );
}

Lenkeknapp.propTypes = {
    href: PT.string.isRequired,
    className: PT.string
};

export default Lenkeknapp;
