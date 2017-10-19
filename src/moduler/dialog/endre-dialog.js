import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Checkbox } from 'nav-frontend-skjema';
import { hentIdentitet } from '../identitet/identitet-duck';
import hiddenIf from '../../felles-komponenter/hidden-if/hidden-if';
import { selectErVeileder } from '../identitet/identitet-selector';
import {
    oppdaterFerdigbehandlet,
    oppdaterVenterPaSvar,
} from './dialog-reducer';

class EndreDialogStatus extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
    }

    render() {
        const {
            kanEndreDialog,
            venterPaSvar,
            ferdigBehandlet,
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
                    label={
                        <FormattedMessage id="dialog.ikke-ferdigbehandlet" />
                    }
                    onChange={toggleFerdigbehandlet}
                    checked={!ferdigBehandlet}
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
    ferdigBehandlet: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    kanEndreDialog: selectErVeileder(state),
});

const mapDispatchToProps = (dispatch, props) => {
    const dialog = props.dialog;
    const dialogId = dialog.id;
    const ferdigBehandlet = dialog.ferdigBehandlet;
    const venterPaSvar = dialog.venterPaSvar;
    return {
        doHentIdentitet: () => dispatch(hentIdentitet()),
        toggleFerdigbehandlet: () =>
            dispatch(oppdaterFerdigbehandlet(dialogId, !ferdigBehandlet)),
        toggleVentePaSvar: () =>
            dispatch(oppdaterVenterPaSvar(dialogId, !venterPaSvar)),

        venterPaSvar,
        ferdigBehandlet,
    };
};

export default hiddenIf(
    connect(mapStateToProps, mapDispatchToProps)(EndreDialogStatus)
);
