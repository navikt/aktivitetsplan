/* eslint-disable react/no-danger */
import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';

const cls = (className) => classNames('unsafe-html', className);

function UnsafeHtml({ className, children, ...props }) {
    return (
        <div className={cls(className)} dangerouslySetInnerHTML={{ __html: children }} {...props} />
    );
}

UnsafeHtml.propTypes = {
    children: PT.node.isRequired,
    className: PT.string
};

export default UnsafeHtml;
