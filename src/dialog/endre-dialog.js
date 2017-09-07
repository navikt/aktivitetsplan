import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Checkbox } from 'nav-frontend-skjema';
import { hentIdentitet } from '../moduler/identitet/identitet-duck';
import { oppdaterFerdigbehandlet, oppdaterVenterPaSvar } from '../ducks/dialog';
import hiddenIf from '../felles-komponenter/hidden-if/hidden-if';
import { selectErVeileder } from '../moduler/identitet/identitet-selector';

class EndreDialogStatus extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
    }

    render() {
        const {
            kanEndreDialog,
            venterPaSvar,
            ikkeFerdigBehandlet,
            toggleFerdigbehandlet,
            toggleVentePaSvar,
        } = this.props;
        if (!kanEndreDialog) {
            return <div />;
        }
        return (
            <div className="endre-dialog__sjekkbokser">
                <Checkbox
                    className="endre-dialog__sjekkboks"
                    label={<FormattedMessage id="dialog.ferdigbehandlet" />}
                    onChange={toggleFerdigbehandlet}
                    checked={ikkeFerdigBehandlet}
                />
                <Checkbox
                    label={<FormattedMessage id="dialog.venter-pa-svar" />}
                    className="endre-dialog__sjekkboks"
                    onChange={toggleVentePaSvar}
                    checked={venterPaSvar}
                />
            </div>
        );
    }
}

EndreDialogStatus.propTypes = {
    doHentIdentitet: PT.func.isRequired,
    toggleFerdigbehandlet: PT.func.isRequired,
    toggleVentePaSvar: PT.func.isRequired,
    kanEndreDialog: PT.bool.isRequired,
    venterPaSvar: PT.bool.isRequired,
    ikkeFerdigBehandlet: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    kanEndreDialog: selectErVeileder(state),
});

const mapDispatchToProps = (dispatch, props) => {
    const dialog = props.dialog;
    const dialogId = dialog.id;
    const ikkeFerdigBehandlet = !dialog.ferdigBehandlet;
    const venterPaSvar = dialog.venterPaSvar;
    return {
        doHentIdentitet: () => dispatch(hentIdentitet()),
        toggleFerdigbehandlet: () =>
            dispatch(oppdaterFerdigbehandlet(dialogId, !ikkeFerdigBehandlet)),
        toggleVentePaSvar: () =>
            dispatch(oppdaterVenterPaSvar(dialogId, !venterPaSvar)),

        venterPaSvar,
        ikkeFerdigBehandlet,
    };
};

export default hiddenIf(
    connect(mapStateToProps, mapDispatchToProps)(EndreDialogStatus)
);
