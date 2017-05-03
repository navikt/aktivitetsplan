import React, { PropTypes as PT } from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment';
import { validForm, rules } from 'react-redux-form-validation';
import { Hovedknapp } from 'nav-frontend-knapper';
import Textarea from './textarea/textarea';
import Input from './input/input';
import Datovelger from './datovelger/datovelger';
import './skjema.less';
import { STATUS_BRUKER_ER_INTRESSERT } from '../../constant';

const TITTEL_MAKS_LENGDE = 255;
const HENSIKT_MAKS_LENGDE = 255;
const LENKE_MAKS_LENGDE = 2000;
const BESKRIVELSE_MAKS_LENGDE = 5000;

const pakrevdTittel = rules.minLength(0, 'Du må fylle ut overskriften');
const begrensetTittelLengde =
    rules.maxLength(TITTEL_MAKS_LENGDE, `Overskriften kan ikke være lenger en ${TITTEL_MAKS_LENGDE} tegn`);
const pakrevdFraDato = rules.minLength(0, 'Du må fylle ut fra datoen');
const pakrevdTilDato = rules.minLength(0, 'Du må fylle ut fristen');
const begrensetHensiktLengde =
    rules.maxLength(HENSIKT_MAKS_LENGDE, `Hensiktteksten kan ikke være lenger en ${HENSIKT_MAKS_LENGDE} tegn`);
const begrensetLenkeLengde =
    rules.maxLength(LENKE_MAKS_LENGDE, `Lenken kan ikke være lenger en ${LENKE_MAKS_LENGDE} tegn`);
const begrensetBeskrivelseLengde =
    rules.maxLength(BESKRIVELSE_MAKS_LENGDE, `Beskrivelsen kan ikke være lenger en ${BESKRIVELSE_MAKS_LENGDE} tegn`);


function EgenAktivitetForm(props) {
    return (
        <form onSubmit={props.handleSubmit} noValidate="noValidate">
            <div className="skjema-innlogget aktivitetskjema">
                {props.errorSummary}
                <div className="aktivitetskjema__header">
                    <Innholdstittel>
                        <FormattedMessage id="egen-aktivitet-form.header" />
                    </Innholdstittel>
                    <Undertekst>
                        <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                    </Undertekst>
                </div>

                <Input feltNavn="tittel"
                       disabled={props.avtalt === true}
                       labelId="egen-aktivitet-form.label.overskrift"
                       bredde="fullbredde" />
                <div className="dato-container">
                    <Datovelger
                        feltNavn="fraDato"
                        disabled={props.avtalt === true}
                        labelId="egen-aktivitet-form.label.fra-dato"
                        senesteTom={props.currentTilDato}
                    />
                    <Datovelger
                        feltNavn="tilDato"
                        labelId="egen-aktivitet-form.label.til-dato"
                        tidligsteFom={props.currentFraDato}
                    />
                </div>
                <Input feltNavn="lenke"
                       disabled={props.avtalt === true}
                       labelId="egen-aktivitet-form.label.lenke"
                       bredde="fullbredde" />
                <Input feltNavn="hensikt"
                       disabled={props.avtalt === true}
                       labelId="egen-aktivitet-form.label.hensikt"
                       bredde="fullbredde" />
                <Textarea
                    feltNavn="beskrivelse"
                    disabled={props.avtalt === true}
                    labelId="egen-aktivitet-form.label.beskrivelse"
                    maxLength={BESKRIVELSE_MAKS_LENGDE}
                />
            </div>
            <div className="aktivitetskjema__lagre-knapp">
                <Hovedknapp><FormattedMessage id="egen-aktivitet-form.lagre" /></Hovedknapp>
            </div>
        </form>
    );
}

EgenAktivitetForm.propTypes = {
    handleSubmit: PT.func,
    errorSummary: PT.node.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date),
    avtalt: PT.bool
};

const formNavn = 'egen-aktivitet';
const EgenAktivitetReduxForm = validForm({
    form: formNavn,
    errorSummaryTitle: <FormattedMessage id="egen-aktivitet-form.feiloppsummering-tittel" />,
    validate: {
        tittel: [pakrevdTittel, begrensetTittelLengde],
        fraDato: [pakrevdFraDato],
        tilDato: [pakrevdTilDato],
        lenke: [begrensetLenkeLengde],
        hensikt: [begrensetHensiktLengde],
        beskrivelse: [begrensetBeskrivelseLengde]
    }
})(EgenAktivitetForm);

const selector = formValueSelector(formNavn);
const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: STATUS_BRUKER_ER_INTRESSERT,
            ...aktivitet
        },
        currentFraDato: selector(state, 'fraDato') ? moment(selector(state, 'fraDato')).toDate() : undefined,
        currentTilDato: selector(state, 'tilDato') ? moment(selector(state, 'tilDato')).toDate() : undefined,
        avtalt: aktivitet && aktivitet.avtalt
    };
};
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EgenAktivitetReduxForm);
