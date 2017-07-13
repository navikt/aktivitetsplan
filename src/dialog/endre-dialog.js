import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { oppdaterDialog } from '../ducks/dialog';
import { hentIdentitet } from '../ducks/identitet';
import Checkbox from '../felles-komponenter/skjema/input/checkbox';
import visibleIf from '../hocs/visible-if';

class EndreDialogStatusForm extends Component {
    componentDidMount() {
        this.props.doHentIdentitet();
    }

    render() {
        const { kanEndreDialog, handleSubmit } = this.props;
        if (!kanEndreDialog) {
            return <div />;
        }
        return (
            <form onSubmit={handleSubmit}>
                <Checkbox
                    className="endre-dialog__sjekkboks"
                    feltNavn="ferdigBehandlet"
                    labelId="dialog.ferdigbehandlet"
                    submitOnChange
                />
                <Checkbox
                    className="endre-dialog__sjekkboks"
                    feltNavn="venterPaSvar"
                    labelId="dialog.venter-pa-svar"
                    submitOnChange
                />
            </form>
        );
    }
}

EndreDialogStatusForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    doHentIdentitet: PT.func.isRequired,
    kanEndreDialog: PT.bool.isRequired,
};

const EndreDialogStatusReduxForm = reduxForm()(EndreDialogStatusForm);

const mapStateToProps = (state, props) => {
    const dialog = props.dialog;
    return {
        kanEndreDialog: state.data.identitet.data.erVeileder,
        form: props.formNavn,
        initialValues: {
            id: dialog.id,
            venterPaSvar: dialog.venterPaSvar,
            ferdigBehandlet: dialog.ferdigBehandlet,
        },
    };
};

const mapDispatchToProps = dispatch => ({
    doHentIdentitet: () => dispatch(hentIdentitet()),
    onSubmit: formData => {
        dispatch(oppdaterDialog(formData));
    },
});

const EndreDialogStatusReduxFormConnected = connect(
    mapStateToProps,
    mapDispatchToProps
)(EndreDialogStatusReduxForm);

function DynamiskEndreDialogStatusReduxFormConnected(props) {
    // TODO setter key=formNavn for å tvinge unmount/mount hvis denne endrer seg.
    // Dette burde kanskje kommet ut av boksen fra 'react-redux-form-validation' ?
    return (
        <EndreDialogStatusReduxFormConnected key={props.formNavn} {...props} />
    );
}

DynamiskEndreDialogStatusReduxFormConnected.propTypes = {
    formNavn: PT.string.isRequired,
};

export default visibleIf(DynamiskEndreDialogStatusReduxFormConnected);
