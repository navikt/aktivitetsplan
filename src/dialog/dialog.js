import React, { PropTypes as PT } from 'react';
import { Element, Undertittel } from 'nav-frontend-typografi';
import NyHenvendelse from './ny-henvendelse';
import Henvendelser from './henvendelser';
import * as AppPT from '../proptypes';


function Dialog({ dialog, className }) {
    const dialogId = dialog.id;
    return (
        <div className={className}>
            <Undertittel >{dialog.overskrift}</Undertittel>
            <Element>Dialog mellom deg og NAV</Element>
            <NyHenvendelse formNavn={`ny-henvendelse-dialog-${dialogId}`} dialogId={dialogId} />
            <Henvendelser dialog={dialog} />
        </div>
    );
}

Dialog.propTypes = {
    className: PT.string,
    dialog: AppPT.dialog.isRequired
};

export default Dialog;
