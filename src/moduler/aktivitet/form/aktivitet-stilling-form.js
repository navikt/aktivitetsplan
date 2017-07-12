import React, { Component } from 'react';
import PT from 'prop-types';
import { formValueSelector, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment';
import { Hovedknapp } from 'nav-frontend-knapper';
import { validForm, rules } from 'react-redux-form-validation';
import { dateToISODate } from '../../../utils';
import Textarea from '../../../felles-komponenter/skjema/textarea/textarea';
import Input from '../../../felles-komponenter/skjema/input/input';
import Datovelger from '../../../felles-komponenter/skjema/datovelger/datovelger';
import { STATUS_PLANLAGT } from '../../../constant';
import PeriodeValidering from '../../../felles-komponenter/skjema/datovelger/periode-validering';

const TITTEL_MAKS_LENGDE = 255;
const LENKE_MAKS_LENGDE = 2000;
const BESKRIVELSE_MAKS_LENGDE = 5000;
const ARBEIDSSTED_MAKS_LENGDE = 255;
const ARBEIDSGIVER_MAKS_LENGDE = 255;
const KONTAKTPERSON_MAKS_LENGDE = 255;

const pakrevdTittel = rules.minLength(
    0,
    <FormattedMessage id="stilling-aktivitet-form.feilmelding.paakrevd-tittel" />
);
const begrensetTittelLengde = rules.maxLength(
    TITTEL_MAKS_LENGDE,
    <FormattedMessage
        id="stilling-aktivitet-form.feilmelding.tittel-lengde"
        values={{ TITTEL_MAKS_LENGDE }}
    />
);
const pakrevdFraDato = rules.minLength(
    0,
    <FormattedMessage id="stilling-aktivitet-form.feilmelding.paakrevd-fradato" />
);
const pakrevdTilDato = rules.minLength(
    0,
    <FormattedMessage id="stilling-aktivitet-form.feilmelding.paakrevd-tildato" />
);
const begrensetLenkeLengde = rules.maxLength(
    LENKE_MAKS_LENGDE,
    <FormattedMessage
        id="stilling-aktivitet-form.feilmelding.lenke-lengde"
        values={{ LENKE_MAKS_LENGDE }}
    />
);
const begrensetBeskrivelseLengde = rules.maxLength(
    BESKRIVELSE_MAKS_LENGDE,
    <FormattedMessage
        id="stilling-aktivitet-form.feilmelding.beskrivelse-lengde"
        values={{ BESKRIVELSE_MAKS_LENGDE }}
    />
);
const begrensetArbeidsstedLengde = rules.maxLength(
    ARBEIDSSTED_MAKS_LENGDE,
    <FormattedMessage
        id="stilling-aktivitet-form.feilmelding.arbeidssted-lengde"
        values={{ ARBEIDSSTED_MAKS_LENGDE }}
    />
);
const begrensetArbeidsgiverLengde = rules.maxLength(
    ARBEIDSGIVER_MAKS_LENGDE,
    <FormattedMessage
        id="stilling-aktivitet-form.feilmelding.arbeidsgiver-lengde"
        values={{ ARBEIDSGIVER_MAKS_LENGDE }}
    />
);
const begrensetKontaktpersonLengde = rules.maxLength(
    KONTAKTPERSON_MAKS_LENGDE,
    <FormattedMessage
        id="stilling-aktivitet-form.feilmelding.kontaktperson-lengde"
        values={{ KONTAKTPERSON_MAKS_LENGDE }}
    />
);

class StillingAktivitetForm extends Component {
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
                            <FormattedMessage id="stilling-aktivitet-form.header" />
                        </Innholdstittel>
                        <Undertekst>
                            <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                        </Undertekst>
                    </div>

                    <Input
                        feltNavn="tittel"
                        disabled={this.props.avtalt === true}
                        labelId="stilling-aktivitet-form.label.overskrift"
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
                                labelId="stilling-aktivitet-form.label.fra-dato"
                                senesteTom={this.props.currentTilDato}
                            />
                            <Datovelger
                                feltNavn="tilDato"
                                labelId="stilling-aktivitet-form.label.til-dato"
                                tidligsteFom={this.props.currentFraDato}
                            />
                        </div>
                    </PeriodeValidering>

                    <Input
                        feltNavn="lenke"
                        disabled={this.props.avtalt === true}
                        labelId="stilling-aktivitet-form.label.lenke"
                    />
                    <Textarea
                        feltNavn="beskrivelse"
                        disabled={this.props.avtalt === true}
                        labelId="stilling-aktivitet-form.label.beskrivelse"
                        maxLength={BESKRIVELSE_MAKS_LENGDE}
                        visTellerFra={500}
                    />
                    <Input
                        feltNavn="arbeidssted"
                        disabled={this.props.avtalt === true}
                        labelId="stilling-aktivitet-form.label.arbeidssted"
                    />
                    <Input
                        feltNavn="arbeidsgiver"
                        disabled={this.props.avtalt === true}
                        labelId="stilling-aktivitet-form.label.arbeidsgiver"
                    />
                    <Input
                        feltNavn="kontaktperson"
                        disabled={this.props.avtalt === true}
                        labelId="stilling-aktivitet-form.label.kontaktperson"
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

StillingAktivitetForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    errorSummary: PT.node.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date),
    isDirty: PT.bool.isRequired,
    intl: intlShape.isRequired,
    avtalt: PT.bool,
};

StillingAktivitetForm.defaultProps = {
    currentFraDato: undefined,
    currentTilDato: undefined,
    avtalt: false,
};

export const formNavn = 'stilling-aktivitet';
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

const selector = formValueSelector(formNavn);
// eslint-disable-next-line no-confusing-arrow
const getDateFromField = field =>
    field == null ? null : moment(field).toDate();

const mapStateToProps = (state, props) => {
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

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(StillingAktivitetReduxForm)
);
