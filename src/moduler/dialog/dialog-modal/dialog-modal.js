import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import NavFrontendModal from 'nav-frontend-modal';
import * as AppPT from '../../../proptypes';
import { selectFnrPaMotpartHvisBruker, selectMotpartStatus, selectNavnPaMotpart } from '../../motpart/motpart-selector';
import {
    selectDialogFeilmeldinger,
    selectDialogMedId,
    selectTilpasseDialogModalHistoriskVisning
} from '../dialog-selector';
import { selectViserHistoriskPeriode } from '../../filtrering/filter/filter-selector';
import Feilmelding from '../../feilmelding/feilmelding';
import DialogHeader from './dialog-header';
import DialogOversikt from './dialog-oversikt';
import DialogHenvendelse from './dialog-henvendelse';
import FnrProvider from '../../../bootstrap/fnr-provider';
import { selectErBruker, selectErVeileder } from '../../identitet/identitet-selector';
import loggEvent, { hash } from '../../../felles-komponenter/utils/logging';
import { selectAktorId, selectUnderOppfolging } from '../../oppfolging-status/oppfolging-selector';
import { harNyDialogToggel } from '../../../felles-komponenter/feature/feature';
import { selectFeatureData } from '../../../felles-komponenter/feature/feature-selector';
import { dialogLenke } from '../DialogLink';

const LOGGING_ANTALLBRUKERE_DIALOG = 'aktivitetsplan.antallBrukere.dialog';

function loggingAntallBrukereDialog(typeEvent, erVeileder, aktorId, underOppfolging) {
    const id = underOppfolging ? hash(aktorId) : 'ikke-under-oppfolging';
    loggEvent(typeEvent, { erVeileder, underOppfolging, id });
}

class DialogModal extends Component {
    componentDidMount() {
        const { erVeileder, valgtDialog, nyDialogToggel, aktorId, underOppfolging } = this.props;

        if (nyDialogToggel) {
            if (!erVeileder) {
                const url = dialogLenke(erVeileder, undefined, valgtDialog);
                window.location.replace(url);
            }
        } else {
            loggingAntallBrukereDialog(LOGGING_ANTALLBRUKERE_DIALOG, {
                erVeileder,
                aktorId,
                underOppfolging
            });
        }
    }

    render() {
        const {
            harNyDialogEllerValgtDialog,
            tilpasseStorrelseHistoriskVisning,
            motpartStatus,
            navnPaMotpart,
            fnrPaMotpartHvisBruker,
            valgtDialog,
            harNyDialog,
            harValgtDialog,
            historiskVisning,
            underOppfolging,
            dialogFeilmeldinger,
            history,
            nyDialogToggel,
            erVeileder
        } = this.props;
        const className = classNames('dialog-modal', 'aktivitet-modal', {
            'dialog-modal--full-bredde': harNyDialogEllerValgtDialog,
            'dialog-modal--historisk-visning': tilpasseStorrelseHistoriskVisning
        });

        if (nyDialogToggel && !erVeileder) {
            return null;
        }

        return (
            <NavFrontendModal
                isOpen
                className={className}
                contentClass="aktivitetsplanfs dialog-modal__content"
                contentLabel="dialog-modal"
                overlayClassName="aktivitet-modal__overlay"
                portalClassName="aktivitetsplanfs aktivitet-modal-portal"
                onRequestClose={() => history.push('/')}
            >
                <DialogHeader
                    harNyDialogEllerValgtDialog={harNyDialogEllerValgtDialog}
                    motpartStatus={motpartStatus}
                    navnPaMotpart={navnPaMotpart}
                    fnrPaMotpartHvisBruker={fnrPaMotpartHvisBruker}
                />
                <FnrProvider>
                    <div className="dialog-modal__wrapper">
                        <Feilmelding className="feilmelding--systemfeil" feilmeldinger={dialogFeilmeldinger} />
                        <div className="dialog-modal__innhold">
                            <DialogOversikt
                                valgtDialog={valgtDialog}
                                harNyDialog={harNyDialog}
                                harNyDialogEllerValgtDialog={harNyDialogEllerValgtDialog}
                                historiskVisning={historiskVisning}
                                underOppfolging={underOppfolging}
                            />
                            <DialogHenvendelse
                                valgtDialog={valgtDialog}
                                harNyDialog={harNyDialog}
                                harValgtDialog={harValgtDialog}
                                harNyDialogEllerValgtDialog={harNyDialogEllerValgtDialog}
                            />
                        </div>
                    </div>
                </FnrProvider>
            </NavFrontendModal>
        );
    }
}

DialogModal.defaultProps = {
    navnPaMotpart: null,
    fnrPaMotpartHvisBruker: null,
    valgtDialog: null,
    harNyDialog: null,
    dialogFeilmeldinger: []
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
    aktorId: PT.string.isRequired,
    intl: intlShape.isRequired,
    erVeileder: PT.bool.isRequired,
    nyDialogToggel: PT.bool.isRequired
};
const mapStateToProps = (state, props) => {
    const { match } = props;
    const { id } = match.params;
    const valgtDialog = selectDialogMedId(state, id);
    const harNyDialog = id === 'ny';
    const harValgtDialog = !!valgtDialog;
    const historiskVisning = selectViserHistoriskPeriode(state);
    const fnrPaMotpartHvisBruker = selectFnrPaMotpartHvisBruker(state);
    const nyDialogToggel = harNyDialogToggel(selectFeatureData(state), selectErBruker(state));
    const aktorId = selectAktorId(state);
    return {
        harNyDialog,
        valgtDialog,
        harValgtDialog,
        nyDialogToggel,
        harNyDialogEllerValgtDialog: harNyDialog || harValgtDialog,
        motpartStatus: selectMotpartStatus(state),
        navnPaMotpart: selectNavnPaMotpart(state),
        fnrPaMotpartHvisBruker,
        historiskVisning,
        aktorId,
        tilpasseStorrelseHistoriskVisning: historiskVisning && selectTilpasseDialogModalHistoriskVisning(state),
        underOppfolging: selectUnderOppfolging(state),
        dialogFeilmeldinger: selectDialogFeilmeldinger(state),
        erVeileder: selectErVeileder(state)
    };
};

export default injectIntl(connect(mapStateToProps)(DialogModal));
