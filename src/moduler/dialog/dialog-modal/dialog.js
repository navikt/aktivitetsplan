import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import NyHenvendelse from './ny-henvendelse';
import EndreDialog from './endre-dialog';
import Henvendelser from './henvendelser';
import * as AppPT from '../../../proptypes';
import { selectAktivitetMedId } from '../../aktivitet/aktivitetliste-selector';
import DialogLenkeTilAktivitet from './dialog-lenke-til-aktivitet';
import { selectUnderOppfolging } from '../../oppfolging-status/oppfolging-selector';

export const endreDialogFormNavn = 'endre-dialog';
export const nyHenvendelseDialogFormNavn = 'ny-henvendelse-dialog';

function Dialog({ dialog, aktivitet, className, underOppfolging }) {
    const dialogId = dialog.id;
    const historisk = dialog.historisk;
    return (
        <div className={className}>
            <Undertittel tag="h1" className="endre-dialog__tittel">
                {aktivitet
                    ? <DialogLenkeTilAktivitet aktivitet={aktivitet} />
                    : dialog.overskrift}
            </Undertittel>
            <EndreDialog
                hidden={historisk || !underOppfolging}
                formNavn={`${endreDialogFormNavn}-${dialogId}`}
                dialog={dialog}
            />
            <NyHenvendelse
                hidden={historisk || !underOppfolging}
                formNavn={`${nyHenvendelseDialogFormNavn}-${dialogId}`}
                dialogId={dialogId}
                skalHaAutofokus={false}
            />
            <Henvendelser dialog={dialog} />
        </div>
    );
}

Dialog.propTypes = {
    className: PT.string,
    dialog: AppPT.dialog.isRequired,
    aktivitet: AppPT.aktivitet,
    underOppfolging: PT.bool.isRequired,
};

Dialog.defaultProps = {
    className: undefined,
    aktivitet: undefined,
};

const mapStateToProps = (state, props) => {
    const aktivitet = selectAktivitetMedId(state, props.dialog.aktivitetId);
    return {
        aktivitet,
        underOppfolging: selectUnderOppfolging(state),
    };
};

export default connect(mapStateToProps)(Dialog);
