import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';
import useFormstate from '@nutgaard/use-formstate';
import { moment } from '../../../utils';
import { hoyreKolonneSectionId, STATUS } from '../../../ducks/utils';
import { nyHenvendelse, oppdaterFerdigbehandlet, oppdaterVenterPaSvar } from '../dialog-reducer';
import { HiddenIfAlertStripeSuksessSolid } from '../../../felles-komponenter/hidden-if/hidden-if-alertstriper';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import hiddenIf from '../../../felles-komponenter/hidden-if/hidden-if';
import { selectErBruker } from '../../identitet/identitet-selector';
import { selectAlleDialoger, selectDialogMedId, selectDialogStatus, selectVisBrukerInfo } from '../dialog-selector';
import { selectAktivitetMedId } from '../../aktivitet/aktivitetliste-selector';
import { visBekreftelse } from '../dialog-view-reducer';
import {
    selectHarSkriveTilgang,
    selectOppfolgingsPerioder,
    selectUnderOppfolging
} from '../../oppfolging-status/oppfolging-selector';
import * as AppPT from '../../../proptypes';
import loggEvent, { loggTidBruktForsteHenvendelse } from '../../../felles-komponenter/utils/logging';
import FormErrorSummary from '../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Checkbox from '../../../felles-komponenter/skjema/input/checkbox';
import Input from '../../../felles-komponenter/skjema/input/input';
import Textarea from '../../../felles-komponenter/skjema/input/textarea';

function label(erBruker, aktivitet) {
    if (!erBruker) {
        return 'Skriv en melding til brukeren';
    }
    if (erBruker && aktivitet) {
        return 'Skriv en melding til NAV-kontoret ditt om denne aktiviteten';
    }
    return 'Skriv en melding til NAV-kontoret ditt om arbeid og oppfølging';
}

function validateOverskrift(val) {
    if (val.trim().length === 0) {
        return 'Du må fylle ut en melding';
    }
    if (val.legend > 255) {
        return 'Du må korte ned teksten til 255 tegn';
    }

    return null;
}

function validateTekst(val) {
    if (val.trim().length === 0) {
        return 'Du må fylle ut en melding';
    }
    if (val.legend > 5000) {
        return 'Du må korte ned teksten til 5000 tegn';
    }

    return null;
}

const validator = useFormstate({
    overskrift: (val, values, props) => (props.erNyDialog ? validateOverskrift(val) : null),
    tekst: validateTekst,
    ikkeFerdigbehandlet: () => null,
    venterPaSvar: () => null
});

function NyHenvendelseForm(props) {
    const {
        overskrift,
        onSubmit,
        harEksisterendeOverskrift,
        erNyDialog,
        oppretter,
        visBrukerInfo,
        erBruker,
        skalHaAutofokus,
        erKnyttTilAktivitet,
        harSkriveTilgang,
        underOppfolging
    } = props;

    const initial = {
        overskrift: overskrift || '',
        tekst: '',
        ikkeFerdigbehandlet: '',
        venterPaSvar: ''
    };

    const state = validator(initial, props);

    return (
        <form
            onSubmit={state.onSubmit(data => {
                state.reinitialize(initial);
                return onSubmit(data, props);
            })}
            className="ny-henvendelse-form"
            autoComplete="off"
        >
            <FormErrorSummary errors={state.errors} submittoken={state.submittoken} />
            <VisibleIfDiv visible={erNyDialog && !erBruker} className="endre-dialog__sjekkbokser">
                <Checkbox
                    className="endre-dialog__sjekkboks"
                    label="Venter på svar fra NAV"
                    disabled={!harSkriveTilgang}
                    {...state.fields.ikkeFerdigbehandlet}
                />
                <Checkbox
                    className="endre-dialog__sjekkboks"
                    label="Venter på svar fra bruker"
                    disabled={!harSkriveTilgang}
                    {...state.fields.venterPaSvar}
                />
            </VisibleIfDiv>

            {harEksisterendeOverskrift || (
                <Input label="Tema" disabled={!harSkriveTilgang || oppretter} autoFocus {...state.fields.overskrift} />
            )}
            <Textarea
                label={label(erBruker, erKnyttTilAktivitet)}
                placeholder="Skriv her"
                maxLength={5000}
                disabled={!harSkriveTilgang || oppretter}
                visTellerFra={1000}
                autoFocus={harEksisterendeOverskrift && skalHaAutofokus}
                {...state.fields.tekst}
            />
            <Hovedknapp type="hoved" spinner={oppretter} disabled={!harSkriveTilgang || oppretter || !underOppfolging}>
                Send
            </Hovedknapp>

            <HiddenIfAlertStripeSuksessSolid style={{ marginTop: '1rem' }} hidden={!visBrukerInfo}>
                Henvendelsen er sendt. Du kan forvente svar i løpet av noen dager.
            </HiddenIfAlertStripeSuksessSolid>
        </form>
    );
}

NyHenvendelseForm.defaultProps = {
    skalHaAutofokus: false,
    oppfolgingsPerioder: [],
    overskrift: undefined
};

NyHenvendelseForm.propTypes = {
    overskrift: PT.string,
    onSubmit: PT.func.isRequired,
    harEksisterendeOverskrift: PT.bool.isRequired,
    oppretter: PT.bool.isRequired,
    erNyDialog: PT.bool.isRequired,
    erBruker: PT.bool.isRequired,
    visBrukerInfo: PT.bool.isRequired,
    skalHaAutofokus: PT.bool,
    erKnyttTilAktivitet: PT.bool.isRequired,
    harSkriveTilgang: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
    oppfolgingsPerioder: PT.arrayOf(AppPT.oppfolgingsPeriode),
    dialoger: PT.arrayOf(AppPT.dialog).isRequired
};

const mapStateToProps = (state, props) => {
    const { aktivitetId } = props;
    const { dialogId } = props;
    const dialog = selectDialogMedId(state, dialogId) || {};
    const dialoger = selectAlleDialoger(state);
    const erNyDialog = Object.keys(dialog).length === 0;
    const aktivitet = selectAktivitetMedId(state, aktivitetId) || {};
    const overskrift = aktivitet.tittel || dialog.overskrift;
    const erBruker = selectErBruker(state);
    return {
        overskrift,
        harEksisterendeOverskrift: !!overskrift,
        erNyDialog,
        oppretter: selectDialogStatus(state) !== STATUS.OK && selectDialogStatus(state) !== STATUS.ERROR,
        erBruker,
        visBrukerInfo: erBruker && selectVisBrukerInfo(state, dialogId),
        erKnyttTilAktivitet: !!aktivitetId || (dialog && !!dialog.aktivitetId),
        harSkriveTilgang: selectHarSkriveTilgang(state),
        underOppfolging: selectUnderOppfolging(state),
        oppfolgingsPerioder: selectOppfolgingsPerioder(state),
        dialoger
    };
};

const mapDispatchToProps = dispatch => ({
    onSubmit: (dialogData, props) => {
        const metrikknavn = props.erNyDialog ? 'aktivitetsplan.ny.dialog' : 'aktivitetsplan.ny.henvendelse';
        loggEvent(metrikknavn, { paaAktivitet: !!dialogData.aktivitetId });
        const nyHenvendelsePromise = nyHenvendelse({
            aktivitetId: props.aktivitetId,
            dialogId: props.dialogId,
            ...dialogData
        })(dispatch);

        const { onComplete } = props;
        nyHenvendelsePromise.then(action => {
            const { data } = action;
            const dialogId = data.id;
            if (props.erNyDialog && !props.erBruker) {
                const ferdigbehandlet = !dialogData.ikkeFerdigbehandlet;
                const venterPaSvar = !!dialogData.venterPaSvar;

                dispatch(oppdaterFerdigbehandlet(dialogId, ferdigbehandlet)).then(() => {
                    dispatch(oppdaterVenterPaSvar(dialogId, venterPaSvar));
                });
            }

            if (onComplete) {
                onComplete(data);
            }

            dispatch(
                visBekreftelse(
                    dialogId,
                    moment()
                        .add(5, 'seconds')
                        .format()
                )
            );

            // hvis man sender en veldig lang henvendelse, ønsker vi å bevare fokus på formen
            if (props.scrollElementId) {
                const scrollElement = document.getElementById(props.scrollElementId);
                scrollElement.scrollIntoView();
            } else {
                document.getElementById(hoyreKolonneSectionId).scrollTop = 0;
            }
        });

        loggTidBruktForsteHenvendelse(props.dialoger, props.oppfolgingsPerioder);

        return Promise.resolve();
    }
});

export default hiddenIf(connect(mapStateToProps, mapDispatchToProps)(NyHenvendelseForm));
