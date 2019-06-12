import React, { Component } from 'react';
import PT from 'prop-types';
import { formValueSelector, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { validForm } from 'react-redux-form-validation';
import { formNavn } from '../aktivitet-form-utils';
import LagreAktivitet from '../lagre-aktivitet';
import { moment, dateToISODate } from '../../../../utils';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import Input from '../../../../felles-komponenter/skjema/input/input';
import Datovelger from '../../../../felles-komponenter/skjema/datovelger/datovelger';
import { STATUS_PLANLAGT, STILLING_AKTIVITET_TYPE } from '../../../../constant';
import PeriodeValidering from '../../../../felles-komponenter/skjema/datovelger/periode-validering';
import {
    maksLengde,
    pakrevd,
} from '../../../../felles-komponenter/skjema/validering';
import AktivitetFormHeader from '../aktivitet-form-header';

function erAvtalt(verdi, props) {
    return !!props.avtalt;
}

const TITTEL_MAKS_LENGDE = 255;
const LENKE_MAKS_LENGDE = 2000;
const BESKRIVELSE_MAKS_LENGDE = 5000;
const ARBEIDSSTED_MAKS_LENGDE = 255;
const ARBEIDSGIVER_MAKS_LENGDE = 255;
const KONTAKTPERSON_MAKS_LENGDE = 255;

const pakrevdTittel = pakrevd(
    'stilling-aktivitet-form.feilmelding.paakrevd-tittel'
).hvisIkke(erAvtalt);

const begrensetTittelLengde = maksLengde(
    'stilling-aktivitet-form.feilmelding.tittel-lengde',
    TITTEL_MAKS_LENGDE
).hvisIkke(erAvtalt);
const pakrevdFraDato = pakrevd(
    'stilling-aktivitet-form.feilmelding.paakrevd-fradato'
).hvisIkke(erAvtalt);

const pakrevdTilDato = pakrevd(
    'stilling-aktivitet-form.feilmelding.paakrevd-tildato'
);

const begrensetLenkeLengde = maksLengde(
    'stilling-aktivitet-form.feilmelding.lenke-lengde',
    LENKE_MAKS_LENGDE
).hvisIkke(erAvtalt);

const begrensetBeskrivelseLengde = maksLengde(
    'stilling-aktivitet-form.feilmelding.beskrivelse-lengde',
    BESKRIVELSE_MAKS_LENGDE
).hvisIkke(erAvtalt);

const begrensetArbeidsstedLengde = maksLengde(
    'stilling-aktivitet-form.feilmelding.arbeidssted-lengde',
    ARBEIDSSTED_MAKS_LENGDE
).hvisIkke(erAvtalt);

const begrensetArbeidsgiverLengde = maksLengde(
    'stilling-aktivitet-form.feilmelding.arbeidsgiver-lengde',
    ARBEIDSGIVER_MAKS_LENGDE
).hvisIkke(erAvtalt);

const begrensetKontaktpersonLengde = maksLengde(
    'stilling-aktivitet-form.feilmelding.kontaktperson-lengde',
    KONTAKTPERSON_MAKS_LENGDE
).hvisIkke(erAvtalt);

// TODO fiks i separat quickfix
// eslint-disable-next-line react/prefer-stateless-function
class StillingAktivitetForm extends Component {
    render() {
        const {props} = this;
        const {
            currentFraDato,
            currentTilDato,
            handleSubmit,
            errorSummary,
            avtalt,
        } = props;
        const erAktivitetAvtalt = avtalt === true;
        return (
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="skjema-innlogget aktivitetskjema">
                    {errorSummary}
                    <AktivitetFormHeader
                        tittelId="stilling-aktivitet-form.header"
                        pakrevdInfoId="aktivitet-form.pakrevd-felt-info"
                        ingressType={STILLING_AKTIVITET_TYPE}
                    />

                    <Input
                        feltNavn="tittel"
                        disabled={erAktivitetAvtalt}
                        labelId="stilling-aktivitet-form.label.overskrift"
                    />

                    <PeriodeValidering
                        feltNavn="periodeValidering"
                        fraDato={currentFraDato}
                        tilDato={currentTilDato}
                        errorMessageId="datepicker.feilmelding.stilling.fradato-etter-frist"
                    >
                        <div className="dato-container">
                            <Datovelger
                                feltNavn="fraDato"
                                disabled={erAktivitetAvtalt}
                                labelId="stilling-aktivitet-form.label.fra-dato"
                                senesteTom={currentTilDato}
                            />
                            <Datovelger
                                feltNavn="tilDato"
                                labelId="stilling-aktivitet-form.label.til-dato"
                                tidligsteFom={currentFraDato}
                            />
                        </div>
                    </PeriodeValidering>

                    <Textarea
                        feltNavn="beskrivelse"
                        disabled={erAktivitetAvtalt}
                        labelId="stilling-aktivitet-form.label.beskrivelse"
                        maxLength={BESKRIVELSE_MAKS_LENGDE}
                        visTellerFra={500}
                    />
                    <Input
                        feltNavn="arbeidssted"
                        disabled={erAktivitetAvtalt}
                        labelId="stilling-aktivitet-form.label.arbeidssted"
                    />
                    <Input
                        feltNavn="arbeidsgiver"
                        disabled={erAktivitetAvtalt}
                        labelId="stilling-aktivitet-form.label.arbeidsgiver"
                    />
                    <Input
                        feltNavn="kontaktperson"
                        disabled={erAktivitetAvtalt}
                        labelId="stilling-aktivitet-form.label.kontaktperson"
                    />
                    <Input
                        feltNavn="lenke"
                        disabled={erAktivitetAvtalt}
                        labelId="stilling-aktivitet-form.label.lenke"
                    />
                </div>
                <LagreAktivitet />
            </form>
        );
    }
}

StillingAktivitetForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    errorSummary: PT.node.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date),
    isDirty: PT.bool.isRequired,
    avtalt: PT.bool,
};

StillingAktivitetForm.defaultProps = {
    currentFraDato: undefined,
    currentTilDato: undefined,
    avtalt: false,
};

const StillingAktivitetReduxForm = validForm({
    form: formNavn,
    errorSummaryTitle: (
        <FormattedMessage id="stilling-aktivitet-form.feiloppsummering-tittel" />
    ),
    validate: {
        tittel: [pakrevdTittel, begrensetTittelLengde],
        fraDato: [pakrevdFraDato],
        tilDato: [pakrevdTilDato],
        lenke: [begrensetLenkeLengde],
        beskrivelse: [begrensetBeskrivelseLengde],
        arbeidssted: [begrensetArbeidsstedLengde],
        arbeidsgiver: [begrensetArbeidsgiverLengde],
        kontaktperson: [begrensetKontaktpersonLengde],
        periodeValidering: [],
    },
})(StillingAktivitetForm);

// eslint-disable-next-line no-confusing-arrow
const getDateFromField = field =>
    field == null ? null : moment(field).toDate();

const mapStateToProps = (state, props) => {
    const selector = formValueSelector(formNavn);
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: STATUS_PLANLAGT,
            fraDato: dateToISODate(new Date()),
            ...aktivitet,
        },
        isDirty: isDirty(formNavn)(state),
        etikett: selector(state, 'etikett'),
        currentFraDato: getDateFromField(selector(state, 'fraDato')),
        currentTilDato: getDateFromField(selector(state, 'tilDato')),
        avtalt: aktivitet && aktivitet.avtalt,
    };
};

export default connect(mapStateToProps)(StillingAktivitetReduxForm);
