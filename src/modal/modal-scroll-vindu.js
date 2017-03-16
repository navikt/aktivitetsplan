import React, { PropTypes as PT } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

function ModalScrollVindu({ children }) {
    return (
        <div className="modal-scroll-vindu">
            <Scrollbars>
                {children}
            </Scrollbars>
        </div>
    );
}

ModalScrollVindu.propTypes = {
    children: PT.node
};

export default ModalScrollVindu;
