import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import NyHenvendelse from './ny-henvendelse';
import EndreDialog from './endre-dialog';
import Henvendelser from './henvendelser';
import * as AppPT from '../../../proptypes';
import { selectAktivitetMedId } from '../../aktivitet/aktivitetliste-selector';
import { erPrivateBrukerSomSkalSkrusAv } from '../../privat-modus/privat-modus-selector';

function Dialog({ dialog, overskrift, className, privateModus }) {
    const dialogId = dialog.id;
    const historisk = dialog.historisk;
    return (
        <div className={className}>
            <Undertittel tag="h1" className="endre-dialog__tittel">
                {overskrift}
            </Undertittel>
            <EndreDialog
                hidden={historisk || privateModus}
                formNavn={`endre-dialog-${dialogId}`}
                dialog={dialog}
            />
            <NyHenvendelse
                hidden={historisk || privateModus}
                formNavn={`ny-henvendelse-dialog-${dialogId}`}
                dialogId={dialogId}
                skalHaAutofokus={false}
            />
            <Henvendelser dialog={dialog} />
        </div>
    );
}

Dialog.propTypes = {
    className: PT.string,
    overskrift: PT.string,
    dialog: AppPT.dialog.isRequired,
    privateModus: PT.bool.isRequired,
};

Dialog.defaultProps = {
    overskrift: undefined,
    className: undefined,
};

const mapStateToProps = (state, props) => {
    const dialog = props.dialog;
    const aktivitet = selectAktivitetMedId(state, dialog.aktivitetId) || {};
    return {
        overskrift: aktivitet.tittel || dialog.overskrift,
        privateModus: erPrivateBrukerSomSkalSkrusAv(state),
    };
};

export default connect(mapStateToProps)(Dialog);
