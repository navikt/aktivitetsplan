import React, { Component } from 'react';
import PT from 'prop-types';
import { formValueSelector, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment';
import { validForm, rules } from 'react-redux-form-validation';
import { Hovedknapp } from 'nav-frontend-knapper';
import AktivitetIngress from './../visning/aktivitetingress';
import Textarea from './textarea/textarea';
import Input from './input/input';
import Datovelger from './datovelger/datovelger';
import './skjema.less';
import { STATUS_GJENNOMFOERT, SOKEAVTALE_AKTIVITET_TYPE } from '../../constant';
import PeriodeValidering from './datovelger/periode-validering';

const OPPFOLGING_MAKS_LENGDE = 5000;
const BESKRIVELSE_MAKS_LENGDE = 5000;

const pakrevdFraDato = rules.minLength(
    0,
    <FormattedMessage id="sokeavtale-aktivitet-form.feilmelding.paakrevd-fradato" />
);
const pakrevdTilDato = rules.minLength(
    0,
    <FormattedMessage id="sokeavtale-aktivitet-form.feilmelding.paakrevd-tildato" />
);

// eslint-disable-next-line no-confusing-arrow
const pakrevdAntall = value =>
    value && value.toString().length > 0
        ? undefined
        : <FormattedMessage id="sokeavtale-aktivitet-form.feilmelding.paakrevd-antall" />;

// eslint-disable-next-line no-confusing-arrow
const numericAntall = value =>
    value && /^[0-9]+$/.test(value)
        ? undefined
        : <FormattedMessage id="sokeavtale-aktivitet-form.feilmelding.numerisk-antall" />;

const begrensetAvtaleOppfolgingLengde = rules.maxLength(
    OPPFOLGING_MAKS_LENGDE,
    <FormattedMessage
        id="sokeavtale-aktivitet-form.feilmelding.oppfolging-lengde"
        values={{ OPPFOLGING_MAKS_LENGDE }}
    />
);
const begrensetBeskrivelseLengde = rules.maxLength(
    BESKRIVELSE_MAKS_LENGDE,
    <FormattedMessage
        id="sokeavtale-aktivitet-form.feilmelding.beskrivelse-lengde"
        values={{ BESKRIVELSE_MAKS_LENGDE }}
    />
);

class SokeAvtaleAktivitetForm extends Component {
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
        const {
            handleSubmit,
            errorSummary,
            currentFraDato,
            currentTilDato,
            intl,
            avtalt,
        } = this.props;
        return (
            <form onSubmit={handleSubmit} noValidate="noValidate">
                <div className="skjema-innlogget aktivitetskjema">
                    {errorSummary}
                    <div className="aktivitetskjema__header">
                        <Innholdstittel>
                            <FormattedMessage id="sokeavtale-aktivitet-form.header" />
                        </Innholdstittel>
                        <Undertekst>
                            <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                        </Undertekst>
                    </div>

                    <AktivitetIngress type={SOKEAVTALE_AKTIVITET_TYPE} />

                    <Input
                        feltNavn="tittel"
                        disabled
                        labelId="sokeavtale-aktivitet-form.label.overskrift"
                        bredde="fullbredde"
                    />

                    <PeriodeValidering
                        feltNavn="periodeValidering"
                        fraDato={currentFraDato}
                        tilDato={currentTilDato}
                        errorMessage={intl.formatMessage({
                            id: 'datepicker.feilmelding.egen.fradato-etter-frist',
                        })}
                    >
                        <div className="dato-container">
                            <Datovelger
                                feltNavn="fraDato"
                                disabled={avtalt === true}
                                labelId="sokeavtale-aktivitet-form.label.fra-dato"
                                senesteTom={currentTilDato}
                            />
                            <Datovelger
                                feltNavn="tilDato"
                                labelId="sokeavtale-aktivitet-form.label.til-dato"
                                tidligsteFom={currentFraDato}
                            />
                        </div>
                    </PeriodeValidering>

                    <Input
                        feltNavn="antall"
                        disabled={avtalt === true}
                        labelId="sokeavtale-aktivitet-form.label.antall"
                        bredde="s"
                    />
                    <Textarea
                        feltNavn="avtaleOppfolging"
                        disabled={avtalt === true}
                        labelId="sokeavtale-aktivitet-form.label.avtale-oppgolging"
                        maxLength={OPPFOLGING_MAKS_LENGDE}
                        visTellerFra={500}
                    />
                    <Textarea
                        feltNavn="beskrivelse"
                        disabled={avtalt === true}
                        labelId="sokeavtale-aktivitet-form.label.beskrivelse"
                        maxLength={BESKRIVELSE_MAKS_LENGDE}
                        visTellerFra={500}
                    />
                </div>
                <div className="aktivitetskjema__lagre-knapp">
                    <Hovedknapp>
                        <FormattedMessage id="egen-aktivitet-form.lagre" />
                    </Hovedknapp>
                </div>
            </form>
        );
    }
}

SokeAvtaleAktivitetForm.propTypes = {
    handleSubmit: PT.func,
    errorSummary: PT.node.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date),
    avtalt: PT.bool,
    isDirty: PT.bool.isRequired,
    intl: intlShape.isRequired,
};

SokeAvtaleAktivitetForm.defaultProps = {
    handleSubmit: undefined,
    currentFraDato: undefined,
    currentTilDato: undefined,
    avtalt: false,
};

export const formNavn = 'sokeavtale-aktivitet';
const SokeavtaleAktivitetReduxForm = validForm({
    form: formNavn,
    errorSummaryTitle: (
        <FormattedMessage id="sokeavtale-aktivitet-form.feiloppsummering-tittel" />
    ),
    validate: {
        fraDato: [pakrevdFraDato],
        tilDato: [pakrevdTilDato],
        antall: [pakrevdAntall, numericAntall],
        beskrivelse: [begrensetBeskrivelseLengde],
        avtaleOppfolging: [begrensetAvtaleOppfolgingLengde],
        periodeValidering: [],
    },
})(SokeAvtaleAktivitetForm);

const selector = formValueSelector(formNavn);
const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: STATUS_GJENNOMFOERT,
            tittel: props.defaultTittel,
            avtalt: true,
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
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(SokeavtaleAktivitetReduxForm)
);
