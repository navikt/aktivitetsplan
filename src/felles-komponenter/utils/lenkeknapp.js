import React from 'react';
import PT from 'prop-types';
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
    className: PT.string,
};

Lenkeknapp.defaultProps = {
    className: undefined,
};

export default Lenkeknapp;
