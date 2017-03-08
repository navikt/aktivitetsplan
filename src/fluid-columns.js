import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';
import { clamp } from './utils';

export const cls = (className, props, ...args) => classNames('flex-container', className, ...args, {
    [`flex-small-${props['cols-sm']}`]: true,
    [`flex-medium-${props['cols-md']}`]: true,
    [`flex-large-${props['cols-lg']}`]: true,
    [`flex-spacing-${clamp(1, 3, props['spacing'])}`]: true,
    'flex-container__center': props.center
});

function FluidColumns({ className, children, stretch, ...props }) {
    let evenPlaceholder = null;
    if (!stretch && children.length % 2 === 1) {
        evenPlaceholder = <span />;
    }

    return (
        <div className={cls(className, props)}>
            {children}
            {evenPlaceholder}
        </div>
    );
}

const numberString = (props, propKey, compName, ...rest) => {
    const parsed = parseInt(props[propKey], 10);
    if (isNaN(parsed)) {
        const type = props[propKey];
        const msg = `Required ${type} \`${propKey}\` was not spcified as a number or parsable string in '${compName}'`;
        return new Error(msg);
    }

    return PT.number({ [`${propKey}`]: parsed }, propKey, compName, ...rest);
};

FluidColumns.defaultProps = {
    'cols-sm': 1,
    'cols-md': 2,
    'cols-lg': 2,
    spacing: 2,
    stretch: true,
    center: false
};

FluidColumns.propTypes = {
    className: PT.string,
    stretch: PT.bool,
    center: PT.bool,
    children: PT.node.isRequired,
    'cols-sm': numberString,
    'cols-md': numberString,
    'cols-lg': numberString,
    spacing: numberString
};

export default FluidColumns;
