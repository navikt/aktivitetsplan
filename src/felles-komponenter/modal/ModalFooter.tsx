import React, { ReactNode } from 'react';

import visibleIfHOC from '../../hocs/visible-if';

interface Props {
    children: ReactNode;
}

const ModalFooter = ({ children }: Props) => <div className="modal-footer">{children}</div>;

export default visibleIfHOC(ModalFooter);
