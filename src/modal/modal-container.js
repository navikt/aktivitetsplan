import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';

const cls = className => classNames(className, 'modal-container');

function ModalContainer({ className, children }) {
    return (
        <div className={cls(className)}>
            {children}
        </div>
    );
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
