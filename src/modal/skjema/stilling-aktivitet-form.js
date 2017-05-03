import React, { PropTypes as PT } from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment';
import { Hovedknapp } from 'nav-frontend-knapper';
import { validForm, rules } from 'react-redux-form-validation';
import { dateToISODate } from '../../utils';
import Textarea from './textarea/textarea';
import Input from './input/input';
import Datovelger from './datovelger/datovelger';
import './skjema.less';
import { STATUS_PLANLAGT } from '../../constant';


const TITTEL_MAKS_LENGDE = 255;
const LENKE_MAKS_LENGDE = 2000;
const BESKRIVELSE_MAKS_LENGDE = 5000;
const ARBEIDSSTED_MAKS_LENGDE = 255;
const ARBEIDSGIVER_MAKS_LENGDE = 255;
const KONTAKTPERSON_MAKS_LENGDE = 255;

const pakrevdTittel = rules.minLength(0, <FormattedMessage id="stilling-aktivitet-form.feilmelding.paakrevd-tittel" />);
const begrensetTittelLengde = rules.maxLength(TITTEL_MAKS_LENGDE,
    <FormattedMessage id="stilling-aktivitet-form.feilmelding.tittel-lengde" values={{ TITTEL_MAKS_LENGDE }} />
);
const pakrevdFraDato = rules.minLength(0, <FormattedMessage id="stilling-aktivitet-form.feilmelding.paakrevd-fradato" />);
const pakrevdTilDato = rules.minLength(0, <FormattedMessage id="stilling-aktivitet-form.feilmelding.paakrevd-tildato" />);
const begrensetLenkeLengde = rules.maxLength(LENKE_MAKS_LENGDE,
    <FormattedMessage id="stilling-aktivitet-form.feilmelding.lenke-lengde" values={{ LENKE_MAKS_LENGDE }} />
);
const begrensetBeskrivelseLengde = rules.maxLength(BESKRIVELSE_MAKS_LENGDE,
    <FormattedMessage id="stilling-aktivitet-form.feilmelding.beskrivelse-lengde" values={{ BESKRIVELSE_MAKS_LENGDE }} />
);
const begrensetArbeidsstedLengde = rules.maxLength(ARBEIDSSTED_MAKS_LENGDE,
    <FormattedMessage id="stilling-aktivitet-form.feilmelding.arbeidssted-lengde" values={{ ARBEIDSSTED_MAKS_LENGDE }} />
);
const begrensetArbeidsgiverLengde = rules.maxLength(ARBEIDSGIVER_MAKS_LENGDE,
    <FormattedMessage id="stilling-aktivitet-form.feilmelding.arbeidsgiver-lengde" values={{ ARBEIDSGIVER_MAKS_LENGDE }} />
);
const begrensetKontaktpersonLengde = rules.maxLength(KONTAKTPERSON_MAKS_LENGDE,
    <FormattedMessage id="stilling-aktivitet-form.feilmelding.kontaktperson-lengde" values={{ KONTAKTPERSON_MAKS_LENGDE }} />
);

function StillingAktivitetForm(props) {
    return (
        <form onSubmit={props.handleSubmit}>
            <div className="skjema-innlogget aktivitetskjema">
                {props.errorSummary}
                <div className="aktivitetskjema__header">
                    <Innholdstittel>
                        <FormattedMessage id="stilling-aktivitet-form.header" />
                    </Innholdstittel>
                    <Undertekst>
                        <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                    </Undertekst>
                </div>

                <Input feltNavn="tittel" labelId="stilling-aktivitet-form.label.overskrift" />
                <div className="dato-container">
                    <Datovelger
                        feltNavn="fraDato"
                        labelId="stilling-aktivitet-form.label.fra-dato"
                        senesteTom={props.currentTilDato}
                    />
                    <Datovelger
                        feltNavn="tilDato"
                        labelId="stilling-aktivitet-form.label.til-dato"
                        tidligsteFom={props.currentFraDato}
                    />
                </div>
                <Input feltNavn="lenke" labelId="stilling-aktivitet-form.label.lenke" />
                <Textarea
                    feltNavn="beskrivelse"
                    labelId="stilling-aktivitet-form.label.beskrivelse"
                    maxLength={BESKRIVELSE_MAKS_LENGDE}
                />
                <Input feltNavn="arbeidssted" labelId="stilling-aktivitet-form.label.arbeidssted" />
                <Input feltNavn="arbeidsgiver" labelId="stilling-aktivitet-form.label.arbeidsgiver" />
                <Input feltNavn="kontaktperson" labelId="stilling-aktivitet-form.label.kontaktperson" />
            </div>
            <div className="aktivitetskjema__lagre-knapp">
                <Hovedknapp><FormattedMessage id="egen-aktivitet-form.lagre" /></Hovedknapp>
            </div>
        </form>
    );
}

StillingAktivitetForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    errorSummary: PT.node.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date)
};

const formNavn = 'stilling-aktivitet';
const StillingAktivitetReduxForm = validForm({
    form: formNavn,
    errorSummaryTitle: <FormattedMessage id="stilling-aktivitet-form.feiloppsummering-tittel" />,
    validate: {
        tittel: [pakrevdTittel, begrensetTittelLengde],
        fraDato: [pakrevdFraDato],
        tilDato: [pakrevdTilDato],
        lenke: [begrensetLenkeLengde],
        beskrivelse: [begrensetBeskrivelseLengde],
        arbeidssted: [begrensetArbeidsstedLengde],
        arbeidsgiver: [begrensetArbeidsgiverLengde],
        kontaktperson: [begrensetKontaktpersonLengde]
    }
})(StillingAktivitetForm);

const selector = formValueSelector(formNavn);
const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: STATUS_PLANLAGT,
            fraDato: dateToISODate(new Date()),
            ...aktivitet
        },
        etikett: selector(state, 'etikett'),
        currentFraDato: moment(selector(state, 'fraDato')).toDate(),
        currentTilDato: moment(selector(state, 'tilDato')).toDate()
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StillingAktivitetReduxForm);
