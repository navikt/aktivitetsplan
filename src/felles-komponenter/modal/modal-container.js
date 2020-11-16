import classNames from 'classnames';
import PT from 'prop-types';
import React from 'react';

const cls = (className) => classNames(className, 'modal-container');

function ModalContainer({ className, children }) {
    return <div className={cls(className)}>{children}</div>;
}

ModalContainer.propTypes = {
    children: PT.node,
    className: PT.string,
};

ModalContainer.defaultProps = {
    children: undefined,
    className: undefined,
};

export default ModalContainer;
