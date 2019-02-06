import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { isDirty } from 'redux-form';
import classNames from 'classnames';
import NavFrontendModal from 'nav-frontend-modal';
import * as AppPT from '../../../proptypes';
import {
    selectFnrPaMotpartHvisBruker,
    selectMotpartStatus,
    selectNavnPaMotpart,
} from '../../motpart/motpart-selector';
import {
    selectTilpasseDialogModalHistoriskVisning,
    selectDialogMedId,
    selectDialogFeilmeldinger,
} from '../dialog-selector';
import { selectViserHistoriskPeriode } from '../../filtrering/filter/filter-selector';
import Feilmelding from '../../feilmelding/feilmelding';
import DialogHeader from './dialog-header';
import DialogOversikt from './dialog-oversikt';
import DialogHenvendelse, { nyDialogFormNavn } from './dialog-henvendelse';
import FnrProvider from './../../../bootstrap/fnr-provider';
import { LUKK_MODAL } from '../../../felles-komponenter/modal/modal-reducer';
import { endreDialogFormNavn, nyHenvendelseDialogFormNavn } from './dialog';
import { selectUnderOppfolging } from '../../oppfolging-status/oppfolging-selector';

function DialogModal({
    harNyDialogEllerValgtDialog,
    tilpasseStorrelseHistoriskVisning,
    motpartStatus,
    navnPaMotpart,
    fnrPaMotpartHvisBruker,
    valgtDialog,
    harNyDialog,
    harValgtDialog,
    historiskVisning,
    history,
    underOppfolging,
    dialogFeilmeldinger,
    intl,
    formIsDirty,
    lukkModal,
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
            onRequestClose={() => {
                const dialogTekst = intl.formatMessage({
                    id: 'aktkivitet-skjema.lukk-advarsel',
                });
                // eslint-disable-next-line no-alert
                if (!formIsDirty || confirm(dialogTekst)) {
                    history.push('/');
                    lukkModal();
                }
            }}
        >
            <DialogHeader
                harNyDialogEllerValgtDialog={harNyDialogEllerValgtDialog}
                motpartStatus={motpartStatus}
                navnPaMotpart={navnPaMotpart}
                fnrPaMotpartHvisBruker={fnrPaMotpartHvisBruker}
            />
            <FnrProvider>
                <div className="dialog-modal__wrapper">
                    <Feilmelding
                        className="feilmelding--systemfeil"
                        feilmeldinger={dialogFeilmeldinger}
                    />
                    <div className="dialog-modal__innhold">
                        <DialogOversikt
                            valgtDialog={valgtDialog}
                            harNyDialog={harNyDialog}
                            harNyDialogEllerValgtDialog={
                                harNyDialogEllerValgtDialog
                            }
                            historiskVisning={historiskVisning}
                            underOppfolging={underOppfolging}
                        />
                        <DialogHenvendelse
                            valgtDialog={valgtDialog}
                            harNyDialog={harNyDialog}
                            harValgtDialog={harValgtDialog}
                            harNyDialogEllerValgtDialog={
                                harNyDialogEllerValgtDialog
                            }
                        />
                    </div>
                </div>
            </FnrProvider>
        </NavFrontendModal>
    );
}

DialogModal.defaultProps = {
    navnPaMotpart: null,
    fnrPaMotpartHvisBruker: null,
    valgtDialog: null,
    harNyDialog: null,
    dialogFeilmeldinger: [],
};

DialogModal.propTypes = {
    harNyDialogEllerValgtDialog: PT.bool.isRequired,
    harNyDialog: PT.bool,
    valgtDialog: AppPT.dialog,
    harValgtDialog: PT.bool.isRequired,
    motpartStatus: AppPT.avhengighet.isRequired,
    navnPaMotpart: PT.string,
    fnrPaMotpartHvisBruker: PT.string,
    historiskVisning: PT.bool.isRequired,
    tilpasseStorrelseHistoriskVisning: PT.bool.isRequired,
    history: AppPT.history.isRequired,
    dialogFeilmeldinger: PT.array,
    underOppfolging: PT.bool.isRequired,
    lukkModal: PT.func.isRequired,
    intl: intlShape.isRequired,
    formIsDirty: PT.bool.isRequired,
};
const mapStateToProps = (state, props) => {
    const { match } = props;
    const { id } = match.params;
    const valgtDialog = selectDialogMedId(state, id);
    const harNyDialog = id === 'ny';
    const harValgtDialog = !!valgtDialog;
    const historiskVisning = selectViserHistoriskPeriode(state);
    const fnrPaMotpartHvisBruker = selectFnrPaMotpartHvisBruker(state);
    return {
        harNyDialog,
        valgtDialog,
        harValgtDialog,
        harNyDialogEllerValgtDialog: harNyDialog || harValgtDialog,
        motpartStatus: selectMotpartStatus(state),
        navnPaMotpart: selectNavnPaMotpart(state),
        fnrPaMotpartHvisBruker,
        historiskVisning,
        tilpasseStorrelseHistoriskVisning:
            historiskVisning &&
            selectTilpasseDialogModalHistoriskVisning(state),
        underOppfolging: selectUnderOppfolging(state),
        dialogFeilmeldinger: selectDialogFeilmeldinger(state),
        formIsDirty:
            isDirty(nyDialogFormNavn)(state) ||
            isDirty(`${endreDialogFormNavn}-${id}`)(state) ||
            isDirty(`${nyHenvendelseDialogFormNavn}-${id}`)(state),
    };
};

const mapDispatchToProps = dispatch => ({
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(DialogModal)
);
