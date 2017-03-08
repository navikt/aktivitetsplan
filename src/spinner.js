import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';

const cls = (className, { negativ, storrelse }) => classNames(className, 'spinner', {
    [`spinner-${storrelse}`]: storrelse,
    'spinner-negativ': negativ
});

function Spinner({ negativ, storrelse, className, ...props }) {
    return (
        <div className={cls(className, { negativ, storrelse })} {...props} />
    );
}

Spinner.propTypes = {
    negativ: PT.bool,
    storrelse: PT.oneOf(['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl']),
    className: PT.string,
    'aria-label': PT.string
};

Spinner.defaultProps = {
    'aria-label': 'Laster innhold'
};

export default Spinner;
