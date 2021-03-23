import classNames from 'classnames';
/* eslint-disable react/no-danger */
import React from 'react';

interface Props {
    className?: string;
    children: string;
}

const UnsafeHtml = (props: Props) => {
    const { className, children, ...rest } = props;

    return (
        <div
            className={classNames('unsafe-html', className)}
            dangerouslySetInnerHTML={{ __html: children }}
            {...rest}
        />
    );
};

export default UnsafeHtml;
