import React, { Component } from 'react';
import PT from 'prop-types';
import { formValueSelector, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { validForm } from 'react-redux-form-validation';
import { moment } from '../../../../utils';
import { formNavn } from '../aktivitet-form-utils';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import Input from '../../../../felles-komponenter/skjema/input/input';
import Datovelger from '../../../../felles-komponenter/skjema/datovelger/datovelger';
import {
    BEHANDLING_AKTIVITET_TYPE,
    STATUS_PLANLAGT,
} from '../../../../constant';
import PeriodeValidering from '../../../../felles-komponenter/skjema/datovelger/periode-validering';
import {
    maksLengde,
    pakrevd,
} from '../../../../felles-komponenter/skjema/validering';
import LagreAktivitet from '../lagre-aktivitet';
import AktivitetFormHeader from '../aktivitet-form-header';

const EFFEKT_MAKS_LENGDE = 255;
const OPPFOLGING_MAKS_LENGDE = 255;
const BESKRIVELSE_MAKS_LENGDE = 5000;
const BEHANDLINGS_TYPE_MAKS_LENGDE = 255;
const BEHANDLINGS_STED_MAKS_LENGDE = 255;

function erAvtalt(verdi, props) {
    return !!props.avtalt;
}

const pakrevdFraDato = pakrevd(
    'behandling-aktivitet-form.feilmelding.paakrevd-fradato'
).hvisIkke(erAvtalt);

const pakrevdTilDato = pakrevd(
    'behandling-aktivitet-form.feilmelding.paakrevd-tildato'
);

const pakrevdBehandlingType = pakrevd(
    'behandling-aktivitet-form.feilmelding.paakrevd-behandling-type'
).hvisIkke(erAvtalt);

const begrensetBehandlingType = maksLengde(
    'behandling-aktivitet-form.feilmelding.behandling-type-lengde',
    BEHANDLINGS_TYPE_MAKS_LENGDE
).hvisIkke(erAvtalt);

const pakrevdBehandlingSted = pakrevd(
    'behandling-aktivitet-form.feilmelding.paakrevd-behandling-sted'
).hvisIkke(erAvtalt);

const begrensetBehandlingSted = maksLengde(
    'behandling-aktivitet-form.feilmelding.behandling-sted-lengde',
    BEHANDLINGS_STED_MAKS_LENGDE
).hvisIkke(erAvtalt);

const begrensetEffektLengde = maksLengde(
    'behandling-aktivitet-form.feilmelding.effekt-lengde',
    EFFEKT_MAKS_LENGDE
).hvisIkke(erAvtalt);
const begrensetBehandlingOppfolgingLengde = maksLengde(
    'behandling-aktivitet-form.feilmelding.oppfolging-lengde',
    OPPFOLGING_MAKS_LENGDE
).hvisIkke(erAvtalt);
const begrensetBeskrivelseLengde = maksLengde(
    'behandling-aktivitet-form.feilmelding.beskrivelse-lengde',
    BESKRIVELSE_MAKS_LENGDE
).hvisIkke(erAvtalt);

// TODO fiks i separat quickfix
// eslint-disable-next-line react/prefer-stateless-function
class BehandlingAktivitetForm extends Component {
    render() {
        const {
            handleSubmit,
            errorSummary,
            currentFraDato,
            currentTilDato,
            avtalt,
        } = this.props;
        const erAktivitetAvtalt = avtalt === true;
        return (
            <form onSubmit={handleSubmit}
                  noValidate="noValidate"
                  autoComplete="off">
                <div className="skjema-innlogget aktivitetskjema">
                    {errorSummary}

                    <AktivitetFormHeader
                        tittelId="behandling-aktivitet-form.header"
                        pakrevdInfoId="aktivitet-form.pakrevd-felt-info"
                        ingressType={BEHANDLING_AKTIVITET_TYPE}
                    />

                    <Input
                        feltNavn="behandlingType"
                        disabled={erAktivitetAvtalt}
                        labelId="behandling-aktivitet-form.label.behandling-type"
                        bredde="fullbredde"
                    />
                    <Input
                        feltNavn="behandlingSted"
                        disabled={erAktivitetAvtalt}
                        labelId="behandling-aktivitet-form.label.behandling-sted"
                        bredde="fullbredde"
                    />

                    <PeriodeValidering
                        feltNavn="periodeValidering"
                        fraDato={currentFraDato}
                        tilDato={currentTilDato}
                        errorMessageId="datepicker.feilmelding.egen.fradato-etter-frist"
                    >
                        <div className="dato-container">
                            <Datovelger
                                feltNavn="fraDato"
                                disabled={erAktivitetAvtalt}
                                labelId="behandling-aktivitet-form.label.fra-dato"
                                senesteTom={currentTilDato}
                            />
                            <Datovelger
                                feltNavn="tilDato"
                                labelId="behandling-aktivitet-form.label.til-dato"
                                tidligsteFom={currentFraDato}
                            />
                        </div>
                    </PeriodeValidering>

                    <Input
                        feltNavn="effekt"
                        disabled={erAktivitetAvtalt}
                        labelId="behandling-aktivitet-form.label.effekt"
                        bredde="fullbredde"
                    />
                    <Textarea
                        feltNavn="beskrivelse"
                        disabled={erAktivitetAvtalt}
                        labelId="behandling-aktivitet-form.label.beskrivelse"
                        maxLength={BESKRIVELSE_MAKS_LENGDE}
                        visTellerFra={500}
                    />
                    <Input
                        feltNavn="behandlingOppfolging"
                        disabled={erAktivitetAvtalt}
                        labelId="behandling-aktivitet-form.label.avtale-oppfolging"
                        bredde="fullbredde"
                    />
                </div>
                <LagreAktivitet />
            </form>
        );
    }
}

BehandlingAktivitetForm.propTypes = {
    handleSubmit: PT.func,
    errorSummary: PT.node.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date),
    avtalt: PT.bool,
    isDirty: PT.bool.isRequired,
};

BehandlingAktivitetForm.defaultProps = {
    handleSubmit: undefined,
    currentFraDato: undefined,
    currentTilDato: undefined,
    avtalt: false,
};

const BehandlingAktivitetReduxForm = validForm({
    form: formNavn,
    errorSummaryTitle: (
        <FormattedMessage id="sokeavtale-aktivitet-form.feiloppsummering-tittel" />
    ),
    validate: {
        behandlingType: [pakrevdBehandlingType, begrensetBehandlingType],
        behandlingSted: [pakrevdBehandlingSted, begrensetBehandlingSted],
        fraDato: [pakrevdFraDato],
        tilDato: [pakrevdTilDato],
        effekt: [begrensetEffektLengde],
        beskrivelse: [begrensetBeskrivelseLengde],
        behandlingOppfolging: [begrensetBehandlingOppfolgingLengde],
        periodeValidering: [],
    },
})(BehandlingAktivitetForm);

const mapStateToProps = (state, props) => {
    const selector = formValueSelector(formNavn);
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: STATUS_PLANLAGT,
            tittel: props.defaultTittel,
            avtalt: false,
            ...aktivitet,
        },
        currentFraDato: selector(state, 'fraDato')
            ? moment(selector(state, 'fraDato')).toDate()
            : undefined,
        currentTilDato: selector(state, 'tilDato')
            ? moment(selector(state, 'tilDato')).toDate()
            : undefined,
        isDirty: isDirty(formNavn)(state),
        avtalt: aktivitet && aktivitet.avtalt,
    };
};

export default connect(mapStateToProps)(BehandlingAktivitetReduxForm);
