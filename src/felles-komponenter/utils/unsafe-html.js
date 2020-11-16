import classNames from 'classnames';
import PT from 'prop-types';
/* eslint-disable react/no-danger */
import React from 'react';

const cls = (className) => classNames('unsafe-html', className);

function UnsafeHtml({ className, children, ...props }) {
    return <div className={cls(className)} dangerouslySetInnerHTML={{ __html: children }} {...props} />;
}

UnsafeHtml.propTypes = {
    children: PT.node.isRequired,
    className: PT.string,
};

UnsafeHtml.defaultProps = {
    className: undefined,
};

export default UnsafeHtml;
