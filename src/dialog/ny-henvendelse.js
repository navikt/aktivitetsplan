import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { validForm, rules } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import Hovedknapp from 'nav-frontend-knapper/src/hovedknapp';
import moment from 'moment';
import { STATUS } from '../ducks/utils';
import {
    nyHenvendelse,
    oppdaterFerdigbehandlet,
    oppdaterVenterPaSvar,
} from '../ducks/dialog';
import Textarea from '../felles-komponenter/skjema/textarea/textarea';
import Input from '../felles-komponenter/skjema/input/input';
import { HiddenIfAlertStripeSuksessSolid } from '../felles-komponenter/hidden-if/hidden-if-alertstriper';
import VisibleIfDiv from '../felles-komponenter/utils/visible-if-div';
import hiddenIf from '../felles-komponenter/hidden-if/hidden-if';
import Checkbox from '../felles-komponenter/skjema/input/checkbox';
import { selectErBruker } from '../moduler/identitet/identitet-selector';
import { selectDialogMedId } from '../moduler/dialog/dialog-selector';

const OVERSKRIFT_MAKS_LENGDE = 255;
const TEKST_MAKS_LENGDE = 5000;
const BESKRIVELSE_MAKS_LENGDE = 5000;

function NyHenvendelseForm({
    handleSubmit,
    harEksisterendeOverskrift,
    erNyDialog,
    oppretter,
    visBrukerInfo,
    erBruker,
    skalHaAutofokus,
}) {
    return (
        <form onSubmit={handleSubmit} className="ny-henvendelse-form">
            <VisibleIfDiv
                visible={erNyDialog && !erBruker}
                className="endre-dialog__sjekkbokser"
            >
                <Checkbox
                    className="endre-dialog__sjekkboks"
                    labelId="dialog.ikke-ferdigbehandlet"
                    feltNavn="ikkeFerdigbehandlet"
                />
                <Checkbox
                    className="endre-dialog__sjekkboks"
                    labelId="dialog.venter-pa-svar"
                    feltNavn="venterPaSvar"
                />
            </VisibleIfDiv>

            <VisibleIfDiv visible={erBruker}>
                <FormattedMessage id="dialog.ingress" />
                <hr />
            </VisibleIfDiv>
            {harEksisterendeOverskrift ||
                <Input
                    feltNavn="overskrift"
                    labelId="dialog.overskrift-label"
                    disabled={oppretter}
                    autoFocus
                />}
            <Textarea
                labelId="dialog.tekst-label"
                feltNavn="tekst"
                placeholder="Skriv her"
                maxLength={BESKRIVELSE_MAKS_LENGDE}
                disabled={oppretter}
                visTellerFra={1000}
                autoFocus={harEksisterendeOverskrift && skalHaAutofokus}
            />
            <Hovedknapp type="hoved" spinner={oppretter} disabled={oppretter}>
                <FormattedMessage id="dialog.lag-ny-dialog" />
            </Hovedknapp>

            <HiddenIfAlertStripeSuksessSolid
                style={{ marginTop: '1rem' }}
                hidden={!visBrukerInfo}
            >
                <FormattedMessage id="dialog.info-til-bruker" />
            </HiddenIfAlertStripeSuksessSolid>
        </form>
    );
}
NyHenvendelseForm.defaultProps = {
    skalHaAutofokus: false,
};

NyHenvendelseForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    harEksisterendeOverskrift: PT.bool.isRequired,
    oppretter: PT.bool.isRequired,
    erNyDialog: PT.bool.isRequired,
    erBruker: PT.bool.isRequired,
    visBrukerInfo: PT.bool.isRequired,
    skalHaAutofokus: PT.bool,
};

const pakrevdOverskrift = rules.minLength(
    0,
    <FormattedMessage id="dialog.ny-henvendelse.overskrift.mangler.feilmelding" />
);
const pakrevdTekst = rules.minLength(
    0,
    <FormattedMessage id="dialog.ny-henvendelse.tekst.mangler.feilmelding" />
);

const begrensetTittelLengde = rules.maxLength(
    OVERSKRIFT_MAKS_LENGDE,
    <FormattedMessage
        id="dialog.ny-henvendelse.overskrift.for-lang.feilmelding"
        values={{ antall_tegn: OVERSKRIFT_MAKS_LENGDE }}
    />
);
const begrensetTekstLengde = rules.maxLength(
    TEKST_MAKS_LENGDE,
    <FormattedMessage
        id="dialog.ny-henvendelse.tekst.for-lang.feilmelding"
        values={{ antall_tegn: TEKST_MAKS_LENGDE }}
    />
);

const NyHenvendelseReduxForm = validForm({
    validate: {
        overskrift: [pakrevdOverskrift, begrensetTittelLengde],
        tekst: [pakrevdTekst, begrensetTekstLengde],
    },
})(NyHenvendelseForm);

const mapStateToProps = (state, props) => {
    const aktivitetId = props.aktivitetId;
    const dialogId = props.dialogId;
    const dialogState = state.data.dialog;
    const aktiviteter = state.data.aktiviteter.data;
    const arenaAktiviteter = state.data.arenaAktiviteter.data;
    const dialog = selectDialogMedId(state, dialogId) || {};
    const erNyDialog = Object.keys(dialog).length === 0;
    const aktivitet = aktiviteter.find(a => a.id === aktivitetId) || {};
    const arenaAktivitet =
        arenaAktiviteter.find(a => a.id === aktivitetId) || {};
    const overskrift =
        aktivitet.tittel || arenaAktivitet.tittel || dialog.overskrift;
    const sisteDato = dialog.sisteDato;
    const erBruker = selectErBruker(state);
    return {
        form: props.formNavn,
        initialValues: {
            overskrift,
        },
        harEksisterendeOverskrift: !!overskrift,
        erNyDialog,
        oppretter: dialogState.status !== STATUS.OK,
        erBruker,
        visBrukerInfo: !!(
            erBruker &&
            dialogState.sisteHenvendelseData === dialog &&
            moment(sisteDato).add(5, 's').isAfter(moment())
        ),
    };
};

const mapDispatchToProps = () => ({
    onSubmit: (dialogData, dispatch, props) => {
        const nyHenvendelsePromise = nyHenvendelse({
            aktivitetId: props.aktivitetId,
            dialogId: props.dialogId,
            ...dialogData,
        })(dispatch);

        const onComplete = props.onComplete;
        nyHenvendelsePromise.then(action => {
            const data = action.data;
            if (props.erNyDialog) {
                const dialogId = data.id;
                const ferdigbehandlet = !dialogData.ikkeFerdigbehandlet;
                const venterPaSvar = dialogData.venterPaSvar;

                dispatch(oppdaterFerdigbehandlet(dialogId, ferdigbehandlet));
                dispatch(oppdaterVenterPaSvar(dialogId, venterPaSvar));
            }
            props.reset();
            if (onComplete) {
                onComplete(data);
            }
        });
    },
});

const NyHenvendelseReduxFormConnected = connect(
    mapStateToProps,
    mapDispatchToProps
)(NyHenvendelseReduxForm);

function DynamiskNyHenvendelseReduxFormConnected(props) {
    // TODO setter key=formNavn for å tvinge unmount/mount hvis denne endrer seg.
    // Dette burde kanskje kommet ut av boksen fra 'react-redux-form-validation' ?
    return <NyHenvendelseReduxFormConnected key={props.formNavn} {...props} />;
}

DynamiskNyHenvendelseReduxFormConnected.propTypes = {
    formNavn: PT.string.isRequired,
};

export default hiddenIf(DynamiskNyHenvendelseReduxFormConnected);
