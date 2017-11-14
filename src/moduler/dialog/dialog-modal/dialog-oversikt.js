import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Dialoger from './dialoger';
import Knappelenke from '../../../felles-komponenter/utils/knappelenke';
import { section as HideableSection } from '../../../felles-komponenter/hidden-if/hidden-if';
import * as AppPT from '../../../proptypes';
import DialogFilter from '../dialog-filter';
import history from '../../../history';

function nyDialog() {
    history.push('/dialog/ny');
}

function DialogOversikt({
    valgtDialog,
    harNyDialog,
    harNyDialogEllerValgtDialog,
    historiskVisning,
}) {
    const className = classNames(
        'dialog-modal__kolonne',
        'dialog-modal__kolonne--dialoger',
        {
            'dialog-modal__kolonne--dialoger-valgt-dialog': harNyDialogEllerValgtDialog,
        }
    );

    return (
        <div className={className}>
            <HideableSection
                className="dialog-modal__ny-dialog"
                hidden={historiskVisning}
            >
                <Knappelenke
                    onClick={nyDialog}
                    disabled={harNyDialog}
                    className="dialog-modal__ny-dialog-knapp"
                >
                    <FormattedMessage id="dialog.modal.ny-dialog" />
                </Knappelenke>
                <DialogFilter />
            </HideableSection>
            <Dialoger
                className="dialog-modal__dialoger"
                valgtDialog={valgtDialog}
            />
        </div>
    );
}

DialogOversikt.propTypes = {
    valgtDialog: AppPT.dialog,
    harNyDialog: PT.bool.isRequired,
    harNyDialogEllerValgtDialog: PT.bool.isRequired,
    historiskVisning: PT.bool.isRequired,
};

DialogOversikt.defaultProps = {
    valgtDialog: undefined,
};

export default DialogOversikt;
