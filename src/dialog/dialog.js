import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Undertittel } from 'nav-frontend-typografi';
import NyHenvendelse from './ny-henvendelse';
import Henvendelser from './henvendelser';
import * as AppPT from '../proptypes';
import './dialog.less';


function Dialog({ dialog, className }) {
    const dialogId = dialog.id;
    return (
        <div className={className}>
            <Undertittel >{dialog.overskrift}</Undertittel>
            <Element>
                <FormattedMessage id="dialog.deg-og-nav.tittel" />
            </Element>
            <NyHenvendelse formNavn={`ny-henvendelse-dialog-${dialogId}`} dialogId={dialogId} />
            <Henvendelser dialog={dialog} />
        </div>
    );
}

Dialog.propTypes = {
    className: PT.string,
    dialog: AppPT.dialog.isRequired
};

Dialog.defaultProps = {
    className: undefined
};

export default Dialog;
