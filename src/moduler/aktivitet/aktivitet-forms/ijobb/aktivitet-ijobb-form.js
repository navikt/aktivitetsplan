import React, { Component } from 'react';
import PT from 'prop-types';
import { formValueSelector, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment';
import { Hovedknapp } from 'nav-frontend-knapper';
import { validForm } from 'react-redux-form-validation';
import { formNavn } from '../aktivitet-form-utils';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import Input from '../../../../felles-komponenter/skjema/input/input';
import Datovelger from '../../../../felles-komponenter/skjema/datovelger/datovelger';
import {
    STATUS_PLANLAGT,
    IJOBB_AKTIVITET_TYPE,
    JOBB_STATUS_HELTID,
    JOBB_STATUS_DELTID,
} from '../../../../constant';
import PeriodeValidering from '../../../../felles-komponenter/skjema/datovelger/periode-validering';
import Radio from '../../../../felles-komponenter/skjema/input/radio';
import RadioGruppe from '../../../../felles-komponenter/skjema/input/radio-gruppe';
import AktivitetIngress from '../../visning/aktivitetingress/aktivitetingress';
import {
    pakrevd,
    maksLengde,
} from '../../../../felles-komponenter/skjema/validering';

const TITTEL_MAKS_LENGDE = 255;
const BESKRIVELSE_MAKS_LENGDE = 5000;
const ANSETTELSESFORHOLD_MAKS_LENGDE = 255;
const ARBEIDSTID_MAKS_LENGDE = 255;

function erAvtalt(verdi, props) {
    return !!props.avtalt;
}

const pakrevdTittel = pakrevd(
    'ijobb-aktivitet-form.feilmelding.paakrevd-tittel'
).hvisIkke(erAvtalt);

const begrensetTittelLengde = maksLengde(
    'ijobb-aktivitet-form.feilmelding.typeStilling-lengde',
    TITTEL_MAKS_LENGDE
).hvisIkke(erAvtalt);

const pakrevdFraDato = pakrevd(
    'ijobb-aktivitet-form.feilmelding.paakrevd-fradato'
).hvisIkke(erAvtalt);

const pakrevdTilDato = pakrevd(
    'ijobb-aktivitet-form.feilmelding.paakrevd-tildato'
);

const pakrevdJobbStatus = pakrevd(
    'ijobb-aktivitet-form.feilmelding.paakrevd-jobbStatus'
).hvisIkke(erAvtalt);

const begrensetAnsettelsesforholdLengde = maksLengde(
    'ijobb-aktivitet-form.feilmelding.ansettelsesforhold-lengde',
    ANSETTELSESFORHOLD_MAKS_LENGDE
).hvisIkke(erAvtalt);

const begrensetArbeidstidLengde = maksLengde(
    'ijobb-aktivitet-form.feilmelding.arbeidstid-lengde',
    ARBEIDSTID_MAKS_LENGDE
).hvisIkke(erAvtalt);

const begrensetBeskrivelseLengde = maksLengde(
    'ijobb-aktivitet-form.feilmelding.beskrivelse-lengde',
    BESKRIVELSE_MAKS_LENGDE
).hvisIkke(erAvtalt);

class IJobbAktivitetForm extends Component {
    componentDidMount() {
        window.onbeforeunload = this.visLukkDialog.bind(this);
    }

    componentWillUnmount() {
        window.onbeforeunload = null;
    }

    // eslint-disable-next-line consistent-return
    visLukkDialog(e) {
        if (this.props.isDirty) {
            const melding = this.props.intl.formatMessage({
                id: 'aktkivitet-skjema.lukk-advarsel',
            });
            e.returnValue = melding;
            return melding;
        }
    }

    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <div className="skjema-innlogget aktivitetskjema">
                    {this.props.errorSummary}
                    <div className="aktivitetskjema__header">
                        <Innholdstittel>
                            <FormattedMessage id="ijobb-aktivitet-form.header" />
                        </Innholdstittel>
                        <Undertekst>
                            <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                        </Undertekst>
                    </div>

                    <AktivitetIngress type={IJOBB_AKTIVITET_TYPE} />

                    <Input
                        feltNavn="tittel"
                        disabled={this.props.avtalt === true}
                        labelId="ijobb-aktivitet-form.label.overskrift"
                    />

                    <PeriodeValidering
                        feltNavn="periodeValidering"
                        fraDato={this.props.currentFraDato}
                        tilDato={this.props.currentTilDato}
                        errorMessage={this.props.intl.formatMessage({
                            id:
                                'datepicker.feilmelding.stilling.fradato-etter-frist',
                        })}
                    >
                        <div className="dato-container">
                            <Datovelger
                                feltNavn="fraDato"
                                disabled={this.props.avtalt === true}
                                labelId="ijobb-aktivitet-form.label.fra-dato"
                                senesteTom={this.props.currentTilDato}
                            />
                            <Datovelger
                                feltNavn="tilDato"
                                labelId="ijobb-aktivitet-form.label.til-dato"
                                tidligsteFom={this.props.currentFraDato}
                            />
                        </div>
                    </PeriodeValidering>

                    <RadioGruppe
                        feltNavn="jobbStatus"
                        labelId="ijobb-aktivitet-form.label.jobbStatus"
                    >
                        <Radio
                            feltNavn="jobbStatus"
                            label={
                                <FormattedMessage id="aktivitetdetaljer.jobbStatus-HELTID" />
                            }
                            value={JOBB_STATUS_HELTID}
                            id={`id--${JOBB_STATUS_HELTID}`}
                            disabled={this.props.avtalt === true}
                        />
                        <Radio
                            feltNavn="jobbStatus"
                            label={
                                <FormattedMessage id="aktivitetdetaljer.jobbStatus-DELTID" />
                            }
                            value={JOBB_STATUS_DELTID}
                            id={`id--${JOBB_STATUS_DELTID}`}
                            disabled={this.props.avtalt === true}
                        />
                    </RadioGruppe>

                    <Input
                        feltNavn="ansettelsesforhold"
                        disabled={this.props.avtalt === true}
                        labelId="ijobb-aktivitet-form.label.ansettelsesforhold"
                    />
                    <Input
                        feltNavn="arbeidstid"
                        disabled={this.props.avtalt === true}
                        labelId="ijobb-aktivitet-form.label.arbeidstid"
                    />
                    <Textarea
                        feltNavn="beskrivelse"
                        disabled={this.props.avtalt === true}
                        labelId="ijobb-aktivitet-form.label.beskrivelse"
                        maxLength={BESKRIVELSE_MAKS_LENGDE}
                        visTellerFra={500}
                    />
                </div>
                <div className="aktivitetskjema__lagre-knapp">
                    <Hovedknapp>
                        <FormattedMessage id="aktivitet-form.lagre" />
                    </Hovedknapp>
                </div>
            </form>
        );
    }
}

IJobbAktivitetForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    errorSummary: PT.node.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date),
    isDirty: PT.bool.isRequired,
    intl: intlShape.isRequired,
    avtalt: PT.bool,
};

IJobbAktivitetForm.defaultProps = {
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
        jobbStatus: [pakrevdJobbStatus],
        ansettelsesforhold: [begrensetAnsettelsesforholdLengde],
        arbeidstid: [begrensetArbeidstidLengde],
        beskrivelse: [begrensetBeskrivelseLengde],
        periodeValidering: [],
    },
})(IJobbAktivitetForm);

// eslint-disable-next-line no-confusing-arrow
const getDateFromField = field =>
    field == null ? null : moment(field).toDate();

const mapStateToProps = (state, props) => {
    const selector = formValueSelector(formNavn);
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: STATUS_PLANLAGT,
            ...aktivitet,
        },
        isDirty: isDirty(formNavn)(state),
        currentFraDato: getDateFromField(selector(state, 'fraDato')),
        currentTilDato: getDateFromField(selector(state, 'tilDato')),
        avtalt: aktivitet && aktivitet.avtalt,
    };
};

export default connect(mapStateToProps)(injectIntl(StillingAktivitetReduxForm));
