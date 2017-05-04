import React, { PropTypes as PT } from 'react';
import { visibleIfHOC } from '../hocs/visible-if';

import './modal-footer.less';

function ModalFooter({ children }) {
    return (
        <div className="modal-footer">
            {children}
        </div>
    );
}

ModalFooter.propTypes = {
    children: PT.node
};

export default visibleIfHOC(ModalFooter);
