import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface Props {
    className?: string;
    children: ReactNode;
}

const ModalContainer = (props: Props) => {
    const { className, children } = props;

    return <div className={classNames(className, 'modal-container')}>{children}</div>;
};

export default ModalContainer;
