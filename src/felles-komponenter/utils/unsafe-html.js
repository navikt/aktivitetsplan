/* eslint-disable react/no-danger */
import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';

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
