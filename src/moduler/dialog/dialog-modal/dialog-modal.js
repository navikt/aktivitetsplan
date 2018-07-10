import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import NavFrontendModal from 'nav-frontend-modal';
import * as AppPT from '../../../proptypes';
import {
    selectMotpartStatus,
    selectNavnPaMotpart,
} from '../../motpart/motpart-selector';
import {
    selectTilpasseDialogModalHistoriskVisning,
    selectDialogMedId,
} from '../dialog-selector';
import { selectViserHistoriskPeriode } from '../../filtrering/filter/filter-selector';
import Feilmelding from '../../feilmelding/feilmelding';
import DialogHeader from './dialog-header';
import DialogOversikt from './dialog-oversikt';
import DialogHenvendelse from './dialog-henvendelse';
import FnrProvider from './../../../bootstrap/fnr-provider';

function DialogModalContent({
    harNyDialogEllerValgtDialog,
    valgtDialog,
    harNyDialog,
    historiskVisning,
    harValgtDialog,
    valgtAktivitetId,
}) {
    return (
        <FnrProvider>
            <div className="dialog-modal__wrapper">
                <Feilmelding className="feilmelding--systemfeil" />
                <div className="dialog-modal__innhold">
                    <DialogOversikt
                        valgtDialog={valgtDialog}
                        harNyDialog={harNyDialog}
                        harNyDialogEllerValgtDialog={
                            harNyDialogEllerValgtDialog
                        }
                        historiskVisning={historiskVisning}
                    />
                    <DialogHenvendelse
                        valgtDialog={valgtDialog}
                        harNyDialog={harNyDialog}
                        harValgtDialog={harValgtDialog}
                        valgtAktivitetId={valgtAktivitetId}
                        harNyDialogEllerValgtDialog={
                            harNyDialogEllerValgtDialog
                        }
                    />
                </div>
            </div>
        </FnrProvider>
    );
}

DialogModalContent.propTypes = {
    valgtDialog: AppPT.dialog,
    valgtAktivitetId: PT.string,
    harNyDialog: PT.bool.isRequired,
    harNyDialogEllerValgtDialog: PT.bool.isRequired,
    historiskVisning: PT.bool.isRequired,
    harValgtDialog: PT.bool.isRequired,
};

DialogModalContent.defaultProps = {
    valgtDialog: undefined,
    valgtAktivitetId: undefined,
};

function DialogModal({
    harNyDialogEllerValgtDialog,
    tilpasseStorrelseHistoriskVisning,
    motpartStatus,
    navnPaMotpart,
    valgtDialog,
    valgtAktivitetId,
    harNyDialog,
    harValgtDialog,
    historiskVisning,
    history,
}) {
    const className = classNames('dialog-modal', 'aktivitet-modal', {
        'dialog-modal--full-bredde': harNyDialogEllerValgtDialog,
        'dialog-modal--historisk-visning': tilpasseStorrelseHistoriskVisning,
    });

    return (
        <NavFrontendModal
            isOpen
            className={className}
            contentClass="aktivitetsplanfs dialog-modal__content"
            contentLabel="dialog-modal"
            overlayClassName="aktivitet-modal__overlay"
            portalClassName="aktivitetsplanfs aktivitet-modal-portal"
            shouldCloseOnOverlayClick={false}
            onRequestClose={() => history.push('/')}
        >
            <DialogHeader
                harNyDialogEllerValgtDialog={harNyDialogEllerValgtDialog}
                motpartStatus={motpartStatus}
                navnPaMotpart={navnPaMotpart}
            />
            <DialogModalContent
                valgtDialog={valgtDialog}
                valgtAktivitetId={valgtAktivitetId}
                harNyDialog={harNyDialog}
                harNyDialogEllerValgtDialog={harNyDialogEllerValgtDialog}
                harValgtDialog={harValgtDialog}
                historiskVisning={historiskVisning}
            />
        </NavFrontendModal>
    );
}

DialogModal.defaultProps = {
    valgtAktivitetId: null,
    navnPaMotpart: null,
    valgtDialog: null,
    harNyDialog: null,
};

DialogModal.propTypes = {
    harNyDialogEllerValgtDialog: PT.bool.isRequired,
    harNyDialog: PT.bool,
    valgtDialog: AppPT.dialog,
    harValgtDialog: PT.bool.isRequired,
    valgtAktivitetId: PT.string,
    motpartStatus: AppPT.avhengighet.isRequired,
    navnPaMotpart: PT.string,
    historiskVisning: PT.bool.isRequired,
    tilpasseStorrelseHistoriskVisning: PT.bool.isRequired,
    history: AppPT.history.isRequired,
};
const mapStateToProps = (state, props) => {
    const { match } = props;
    const { id } = match.params;
    const valgtDialog = selectDialogMedId(state, id);
    const valgtAktivitetId = valgtDialog && valgtDialog.aktivitetId;
    const harNyDialog = id === 'ny';
    const harValgtDialog = !!valgtDialog;
    const historiskVisning = selectViserHistoriskPeriode(state);
    return {
        harNyDialog,
        valgtDialog,
        harValgtDialog,
        harNyDialogEllerValgtDialog: harNyDialog || harValgtDialog,
        valgtAktivitetId,
        motpartStatus: selectMotpartStatus(state),
        navnPaMotpart: selectNavnPaMotpart(state),
        historiskVisning,
        tilpasseStorrelseHistoriskVisning:
            historiskVisning &&
            selectTilpasseDialogModalHistoriskVisning(state),
    };
};

export default connect(mapStateToProps)(DialogModal);
