import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { validForm } from 'react-redux-form-validation';
import { formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { OPPRETT_OPPGAVE_FORM } from './opprett-oppgave';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import Textarea from '../../../felles-komponenter/skjema/textarea/textarea';
import {
    begrensetBeskrivelseLengde,
    BESKRIVELSE_MAKS_LENGDE,
    defaultPrioritet,
    enhetlisteToKeyValueMap,
    filtrerBasertPaaTema,
    oppgavetyper,
    prioritet,
    temaValg,
    toLocalDateTime,
    veilederlisteToKeyValueMap,
} from './opprett-oppgave-utils';
import PeriodeValidering from '../../../felles-komponenter/skjema/datovelger/periode-validering';
import Datovelger from '../../../felles-komponenter/skjema/datovelger/datovelger';
import { pakrevd } from '../../../felles-komponenter/skjema/validering';
import { STATUS } from '../../../ducks/utils';
import {
    hentBehandlendeEnheter,
    hentVeiledereForEnhet,
    resetEnheter,
} from '../innstillinger-reducer';
import { getEnhetFromUrl, getFodselsnummer } from '../../../bootstrap/fnr-util';
import Select from '../../../felles-komponenter/skjema/input/select';
import { opprettOppgaveForBruker } from './opprett-oppgave-reducer';
import history from '../../../history';
import * as AppPT from '../../../proptypes';
import { selectBehandlendeEnheter } from '../innstillinger-selector';

const pakrevdFraDato = pakrevd(
    'opprett-oppgave-form.feilmelding.paakrevd-fradato'
);

const pakrevdTilDato = pakrevd(
    'opprett-oppgave-form.feilmelding.paakrevd-tildato'
);

const pakrevdType = pakrevd('opprett-oppgave-form.feilmelding.paakrevd-type');

const pakrevdEnhet = pakrevd('opprett-oppgave-form.feilmelding.paakrevd-enhet');

const HiddenIf = ({ hidden, children }) => {
    if (hidden) {
        return null;
    }
    return children;
};

function optionsFromObject(keyValueMap) {
    return Object.entries(keyValueMap).map(([key, value]) =>
        <option value={key} key={key}>
            {value}
        </option>
    );
}

function finnInitiellEnhet(behandlendeEnheter) {
    if (!behandlendeEnheter || !behandlendeEnheter.enheter) {
        return undefined;
    }
    return '0104';
}

function OpprettOppgaveForm({
    onSubmit,
    behandlendeEnheter,
    currentFraDato,
    currentTilDato,
    opprettOppgave,
    hentEnheter,
    hentVeiledere,
    errorSummary,
    veiledere,
    valgtEnhet,
    tema,
}) {
    const enhetliste =
        behandlendeEnheter.enheter && Array.isArray(behandlendeEnheter.enheter)
            ? behandlendeEnheter.enheter
            : [];
    const veilederliste = veiledere.veilederListe
        ? veiledere.veilederListe
        : [];
    const innloggetEnhet = getEnhetFromUrl();

    return (
        <form onSubmit={onSubmit}>
            <Innholdslaster avhengigheter={[opprettOppgave]}>
                <div className="opprett-oppgave-skjema">
                    {errorSummary}
                    <Select
                        blankOptionParameters={{ hidden: true }}
                        feltNavn="tema"
                        labelId="innstillinger.modal.opprett-oppgave.tema.tittel"
                        bredde="fullbredde"
                        onChange={v => {
                            hentEnheter(v.target.value, getFodselsnummer());
                        }}
                    >
                        {optionsFromObject(temaValg)}
                    </Select>
                    <HiddenIf
                        hidden={
                            behandlendeEnheter.status === STATUS.NOT_STARTED ||
                            !tema
                        }
                    >
                        <Innholdslaster avhengigheter={[behandlendeEnheter]}>
                            <div>
                                <Select
                                    feltNavn="type"
                                    labelId="innstillinger.modal.opprett-oppgave.type.tittel"
                                    bredde="fullbredde"
                                    noBlankOption
                                >
                                    {optionsFromObject(
                                        filtrerBasertPaaTema(oppgavetyper, tema)
                                    )}
                                </Select>

                                <Select
                                    feltNavn="prioritet"
                                    labelId="innstillinger.modal.opprett-oppgave.prioritet.tittel"
                                    bredde="fullbredde"
                                    noBlankOption
                                >
                                    {optionsFromObject(prioritet)}
                                </Select>
                                <PeriodeValidering
                                    feltNavn="periodeValidering"
                                    fraDato={currentFraDato}
                                    tilDato={currentTilDato}
                                    errorMessageId="datepicker.feilmelding.egen.fradato-etter-frist"
                                >
                                    <div className="dato-container">
                                        <Datovelger
                                            feltNavn="fraDato"
                                            labelId="opprett-oppgave-form.label.fra-dato"
                                            senesteTom={currentTilDato}
                                        />
                                        <Datovelger
                                            feltNavn="tilDato"
                                            labelId="opprett-oppgave-form.label.til-dato"
                                            tidligsteFom={currentFraDato}
                                        />
                                    </div>
                                </PeriodeValidering>
                                <div className="enhet-veileder-container">
                                    <Select
                                        blankOptionParameters={{ hidden: true }}
                                        feltNavn="enhet"
                                        labelId="innstillinger.modal.opprett-oppgave.enhet.tittel"
                                        bredde="m"
                                        onChange={v =>
                                            hentVeiledere(v.target.value)}
                                    >
                                        {optionsFromObject(
                                            enhetlisteToKeyValueMap(enhetliste)
                                        )}
                                    </Select>
                                    <HiddenIf
                                        hidden={
                                            innloggetEnhet !== valgtEnhet ||
                                            !innloggetEnhet
                                        }
                                    >
                                        <Innholdslaster
                                            avhengigheter={[veiledere]}
                                        >
                                            <Select
                                                feltNavn="veileder"
                                                bredde="m"
                                                labelId="innstillinger.modal.opprett-oppgave.veileder.tittel"
                                            >
                                                {optionsFromObject(
                                                    veilederlisteToKeyValueMap(
                                                        veilederliste
                                                    )
                                                )}
                                            </Select>
                                        </Innholdslaster>
                                    </HiddenIf>
                                </div>
                                <Textarea
                                    labelId="innstillinger.modal.opprett-oppgave.label.beskrivelse"
                                    feltNavn="beskrivelse"
                                    maxLength={BESKRIVELSE_MAKS_LENGDE}
                                />
                            </div>
                        </Innholdslaster>
                    </HiddenIf>
                </div>
            </Innholdslaster>
        </form>
    );
}

OpprettOppgaveForm.propTypes = {
    onSubmit: PT.func.isRequired,
    behandlendeEnheter: AppPT.behandlendeEnheter.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date),
    opprettOppgave: PT.shape({ status: PT.string }).isRequired,
    hentEnheter: PT.func.isRequired,
    hentVeiledere: PT.func.isRequired,
    errorSummary: PT.node.isRequired,
    veiledere: AppPT.veiledere.isRequired,
    valgtEnhet: PT.string,
    tema: PT.string,
};

OpprettOppgaveForm.defaultProps = {
    valgtEnhet: undefined,
    tema: undefined,
    currentFraDato: undefined,
    currentTilDato: undefined,
};

const OpprettOppgaveReduxForm = validForm({
    form: OPPRETT_OPPGAVE_FORM,
    errorSummaryTitle: (
        <FormattedMessage id="mote-aktivitet-form.feiloppsummering-tittel" />
    ),
    validate: {
        beskrivelse: [begrensetBeskrivelseLengde],
        fraDato: [pakrevdFraDato],
        tilDato: [pakrevdTilDato],
        periodeValidering: [],
        type: [pakrevdType],
        enhet: [pakrevdEnhet],
    },
})(OpprettOppgaveForm);

const mapStateToProps = (state, props) => {
    const selector = formValueSelector(OPPRETT_OPPGAVE_FORM);
    return {
        form: props.formNavn,
        initialValues: {
            fraDato: new Date(),
            tilDato: new Date(),
            prioritet: defaultPrioritet,
            type: Object.keys(oppgavetyper)[0],
            enhet: finnInitiellEnhet(props.behandlendeEnheter),
            beskrivelse: null,
            veileder: null,
        },
        veiledere: state.data.innstillinger.veiledere,
        currentFraDato: selector(state, 'fraDato')
            ? moment(selector(state, 'fraDato')).toDate()
            : undefined,
        currentTilDato: selector(state, 'tilDato')
            ? moment(selector(state, 'tilDato')).toDate()
            : undefined,
        valgtEnhet: selector(state, 'enhet'),
        tema: selector(state, 'tema'),
        opprettOppgave: state.data.opprettOppgave,
        behandlendeEnheter: selectBehandlendeEnheter(state),
    };
};

const mapDispatchToProps = dispatch => ({
    onSubmit: props => {
        dispatch(
            opprettOppgaveForBruker({
                ...props,
                fnr: getFodselsnummer(),
                fraDato: toLocalDateTime(props.fraDato),
                tilDato: toLocalDateTime(props.tilDato),
            })
        )
            .then(() => {
                dispatch(resetEnheter());
                history.push('/');
            })
            .catch(() => {
                dispatch(resetEnheter());
                history.push('innstillinger/feilkvittering');
            });
    },
    hentEnheter: (tema, fnr) =>
        dispatch(hentBehandlendeEnheter(tema, fnr)).catch(() => {
            history.push('innstillinger/feilkvittering');
        }),
    hentVeiledere: enhetId => dispatch(hentVeiledereForEnhet(enhetId)),
});

OpprettOppgaveReduxForm.defaultProps = {};

OpprettOppgaveReduxForm.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(OpprettOppgaveReduxForm)
);
