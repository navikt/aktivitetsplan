import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { Knapp } from 'nav-frontend-knapper';
import Lenke from './lenke';
import visibleIfHOC from '../../hocs/visible-if';

function Lenkeknapp({ href, className, disabled, type, ...rest }) {
    const lenkeknappClassNames = classNames(
        'lenkeknapp',
        type && `lenkeknapp--${type}`,
        className
    );
    if (disabled) {
        return <Knapp {...rest} className={lenkeknappClassNames} disabled />;
    }
    return (
        <Lenke
            {...rest}
            role="button"
            className={lenkeknappClassNames}
            href={href}
        />
    );
}

Lenkeknapp.propTypes = {
    href: PT.string.isRequired,
    type: PT.string,
    className: PT.string,
    disabled: PT.bool,
};

Lenkeknapp.defaultProps = {
    className: undefined,
    type: null,
    disabled: false,
};

export default visibleIfHOC(Lenkeknapp);
