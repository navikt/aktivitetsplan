import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import { withRouter } from 'react-router-dom';
import Dialog from './dialog';
import NyHenvendelse from './ny-henvendelse';
import { div as HiddenIfDiv, section as HiddenIfSection } from '../../../felles-komponenter/hidden-if/hidden-if';
import * as AppPT from '../../../proptypes';
import { hoyreKolonneSectionId } from '../../../ducks/utils';

function DialogHenvendelse({ valgtDialog, harValgtDialog, harNyDialog, harNyDialogEllerValgtDialog, history }) {
    return (
        <HiddenIfSection
            hidden={!harNyDialogEllerValgtDialog}
            className="dialog-modal__kolonne dialog-modal__kolonne--dialog"
            id={hoyreKolonneSectionId}
        >
            <HiddenIfDiv hidden={!harNyDialog}>
                <Undertittel tag="h1" className="endre-dialog__tittel">
                    <FormattedMessage id="dialog.ny-dialog" />
                </Undertittel>
                <NyHenvendelse onComplete={dialog => history.push(`/dialog/${dialog.id}`)} />
            </HiddenIfDiv>
            <HiddenIfDiv hidden={!harValgtDialog}>
                <Dialog dialog={valgtDialog} />
            </HiddenIfDiv>
        </HiddenIfSection>
    );
}

DialogHenvendelse.propTypes = {
    valgtDialog: AppPT.dialog,
    valgtAktivitetId: PT.string,
    harNyDialog: PT.bool.isRequired,
    harValgtDialog: PT.bool.isRequired,
    harNyDialogEllerValgtDialog: PT.bool.isRequired,
    history: AppPT.history.isRequired
};

DialogHenvendelse.defaultProps = {
    valgtDialog: undefined,
    valgtAktivitetId: undefined
};

export default withRouter(DialogHenvendelse);
