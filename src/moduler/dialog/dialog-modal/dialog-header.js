import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { withRouter } from 'react-router-dom';
import PilKnapp from '../../../felles-komponenter/utils/pil-knapp';
import * as AppPT from '../../../proptypes';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';

function DialogHeader({
    harNyDialogEllerValgtDialog,
    motpartStatus,
    navnPaMotpart,
    history,
}) {
    return (
        <div className="dialog-modal__header">
            <FormattedMessage id="dialog.modal.tilbake">
                {label =>
                    <PilKnapp
                        visible={harNyDialogEllerValgtDialog}
                        className="dialog-modal__tilbake-knapp"
                        onClick={() => history.push('/dialog')}
                        aria-label={label}
                    />}
            </FormattedMessage>
            <Innholdslaster avhengigheter={motpartStatus} spinnerStorrelse="M">
                <Element className="dialog-modal__tittel" tag="h1">
                    <FormattedMessage
                        id="dialog.tittel"
                        values={{ motpart: navnPaMotpart }}
                    />
                </Element>
            </Innholdslaster>
        </div>
    );
}

DialogHeader.defaultProps = {
    navnPaMotpart: null,
};

DialogHeader.propTypes = {
    harNyDialogEllerValgtDialog: PT.bool.isRequired,
    motpartStatus: AppPT.avhengighet.isRequired,
    navnPaMotpart: PT.string,
    history: AppPT.history.isRequired,
};

export default withRouter(DialogHeader);
