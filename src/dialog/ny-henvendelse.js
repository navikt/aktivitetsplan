import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { validForm, rules } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import Hovedknapp from 'nav-frontend-knapper/src/hovedknapp';
import { nyHenvendelse } from '../ducks/dialog';
import Textarea from '../modal/skjema/textarea/textarea';
import Input from '../modal/skjema/input/input';

const OVERSKRIFT_MAKS_LENGDE = 255;
const TEKST_MAKS_LENGDE = 2000;

function NyHenvendelseForm({ handleSubmit, harEksisterendeOverskrift }) {
    return (
        <form onSubmit={handleSubmit}>
            { harEksisterendeOverskrift || (
                <Input
                    feltNavn="overskrift"
                    labelId="dialog.overskrift-label"
                    autoFocus
                />
            )}
            <Textarea
                feltNavn="tekst"
                placeholder="Skriv her"
                maxLength={TEKST_MAKS_LENGDE}
            />
            <Hovedknapp type="submit" ><FormattedMessage id="dialog.lag-ny-dialog" /></Hovedknapp>
        </form>
    );
}

NyHenvendelseForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    harEksisterendeOverskrift: PT.bool.isRequired
};

const pakrevdOverskrift = rules.minLength(0, 'Du må fylle ut overskriften');
const pakrevdTekst = rules.minLength(0, 'Du må fylle ut teksten');

const begrensetTittelLengde = rules.maxLength(OVERSKRIFT_MAKS_LENGDE, `Overskriften kan ikke være lenger en ${OVERSKRIFT_MAKS_LENGDE} tegn`);
const begrensetTekstLengde = rules.maxLength(TEKST_MAKS_LENGDE, `Teksten kan ikke være lenger en ${TEKST_MAKS_LENGDE} tegn`);

const NyHenvendelseReduxForm = validForm({
    validate: {
        overskrift: [pakrevdOverskrift, begrensetTittelLengde],
        tekst: [pakrevdTekst, begrensetTekstLengde]
    }
})(NyHenvendelseForm);

const mapStateToProps = (state, props) => {
    const aktivitetId = props.aktivitetId;
    const dialogId = props.dialogId;

    const dialoger = state.data.dialog.data;
    const aktiviteter = state.data.aktiviteter;

    const dialog = dialoger.find((d) => d.id === dialogId) || {};
    const aktivitet = aktiviteter.find((a) => a.id === aktivitetId) || {};

    const overskrift = aktivitet.tittel || dialog.overskrift;
    return {
        form: props.formNavn,
        initialValues: {
            overskrift
        },
        harEksisterendeOverskrift: !!overskrift
    };
};

const mapDispatchToProps = () => ({
    onSubmit: (dialogData, dispatch, props) => {
        const nyHenvendelsePromise = nyHenvendelse({
            aktivitetId: props.aktivitetId,
            dialogId: props.dialogId,
            ...dialogData
        })(dispatch);

        const onComplete = props.onComplete;
        if (onComplete) {
            nyHenvendelsePromise.then((action) => onComplete(action.data));
        }
    }
});

const NyHenvendelseReduxFormConnected = connect(mapStateToProps, mapDispatchToProps)(NyHenvendelseReduxForm);

function DynamiskNyHenvendelseReduxFormConnected(props) {
    // TODO setter key=formNavn for å tvinge unmount/mount hvis denne endrer seg.
    // Dette burde kanskje kommet ut av boksen fra 'react-redux-form-validation' ?
    return <NyHenvendelseReduxFormConnected key={props.formNavn} {...props} />;
}

DynamiskNyHenvendelseReduxFormConnected.propTypes = {
    formNavn: PT.string
};

export default DynamiskNyHenvendelseReduxFormConnected;
