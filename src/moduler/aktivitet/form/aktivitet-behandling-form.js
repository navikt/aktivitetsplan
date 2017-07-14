import React, { Component } from 'react';
import PT from 'prop-types';
import { formValueSelector, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment';
import { validForm, rules } from 'react-redux-form-validation';
import { Hovedknapp } from 'nav-frontend-knapper';
import AktivitetIngress from '../visning/aktivitetingress';
import Textarea from '../../../felles-komponenter/skjema/textarea/textarea';
import Input from '../../../felles-komponenter/skjema/input/input';
import Datovelger from '../../../felles-komponenter/skjema/datovelger/datovelger';
import './skjema.less';
import { STATUS_PLANLAGT, BEHANDLING_AKTIVITET_TYPE } from '../../../constant';
import PeriodeValidering from '../../../felles-komponenter/skjema/datovelger/periode-validering';

const EFFEKT_MAKS_LENGDE = 255;
const OPPFOLGING_MAKS_LENGDE = 255;
const BESKRIVELSE_MAKS_LENGDE = 5000;
const BEHANDLINGS_TYPE_MAKS_LENGDE = 255;
const BEHANDLINGS_STED_MAKS_LENGDE = 255;

const pakrevdFraDato = rules.minLength(
    0,
    <FormattedMessage id="behandling-aktivitet-form.feilmelding.paakrevd-fradato" />
);
const pakrevdTilDato = rules.minLength(
    0,
    <FormattedMessage id="behandling-aktivitet-form.feilmelding.paakrevd-tildato" />
);

const pakrevdBehandlingType = rules.minLength(
    0,
    <FormattedMessage id="behandling-aktivitet-form.feilmelding.paakrevd-behandling-type" />
);

const begrensetBehandlingType = rules.maxLength(
    BEHANDLINGS_TYPE_MAKS_LENGDE,
    <FormattedMessage
        id="behandling-aktivitet-form.feilmelding.behandling-type-lengde"
        values={{ BEHANDLINGS_TYPE_MAKS_LENGDE }}
    />
);

const pakrevdBehandlingSted = rules.minLength(
    0,
    <FormattedMessage id="behandling-aktivitet-form.feilmelding.paakrevd-behandling-sted" />
);

const begrensetBehandlingSted = rules.maxLength(
    BEHANDLINGS_STED_MAKS_LENGDE,
    <FormattedMessage
        id="behandling-aktivitet-form.feilmelding.behandling-sted-lengde"
        values={{ BEHANDLINGS_STED_MAKS_LENGDE }}
    />
);

const begrensetEffektLengde = rules.maxLength(
    EFFEKT_MAKS_LENGDE,
    <FormattedMessage
        id="behandling-aktivitet-form.feilmelding.effekt-lengde"
        values={{ EFFEKT_MAKS_LENGDE }}
    />
);
const begrensetBehandlingOppfolgingLengde = rules.maxLength(
    OPPFOLGING_MAKS_LENGDE,
    <FormattedMessage
        id="behandling-aktivitet-form.feilmelding.oppfolging-lengde"
        values={{ OPPFOLGING_MAKS_LENGDE }}
    />
);
const begrensetBeskrivelseLengde = rules.maxLength(
    BESKRIVELSE_MAKS_LENGDE,
    <FormattedMessage
        id="behandling-aktivitet-form.feilmelding.beskrivelse-lengde"
        values={{ BESKRIVELSE_MAKS_LENGDE }}
    />
);

class BehandlingAktivitetForm extends Component {
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
                            <FormattedMessage id="behandling-aktivitet-form.header" />
                        </Innholdstittel>
                        <Undertekst>
                            <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                        </Undertekst>
                    </div>

                    <AktivitetIngress type={BEHANDLING_AKTIVITET_TYPE} />

                    <Input
                        feltNavn="behandlingType"
                        disabled={avtalt === true}
                        labelId="behandling-aktivitet-form.label.behandling-type"
                        bredde="fullbredde"
                    />
                    <Input
                        feltNavn="behandlingSted"
                        disabled={avtalt === true}
                        labelId="behandling-aktivitet-form.label.behandling-sted"
                        bredde="fullbredde"
                    />

                    <PeriodeValidering
                        feltNavn="periodeValidering"
                        fraDato={currentFraDato}
                        tilDato={currentTilDato}
                        errorMessage={intl.formatMessage({
                            id:
                                'datepicker.feilmelding.egen.fradato-etter-frist',
                        })}
                    >
                        <div className="dato-container">
                            <Datovelger
                                feltNavn="fraDato"
                                disabled={avtalt === true}
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
                        disabled={avtalt === true}
                        labelId="behandling-aktivitet-form.label.effekt"
                        bredde="fullbredde"
                    />
                    <Textarea
                        feltNavn="beskrivelse"
                        disabled={avtalt === true}
                        labelId="behandling-aktivitet-form.label.beskrivelse"
                        maxLength={BESKRIVELSE_MAKS_LENGDE}
                        visTellerFra={500}
                    />
                    <Input
                        feltNavn="behandlingOppfolging"
                        disabled={avtalt === true}
                        labelId="behandling-aktivitet-form.label.avtale-oppfolging"
                        bredde="fullbredde"
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

BehandlingAktivitetForm.propTypes = {
    handleSubmit: PT.func,
    errorSummary: PT.node.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date),
    avtalt: PT.bool,
    isDirty: PT.bool.isRequired,
    intl: intlShape.isRequired,
};

BehandlingAktivitetForm.defaultProps = {
    handleSubmit: undefined,
    currentFraDato: undefined,
    currentTilDato: undefined,
    avtalt: false,
};

export const formNavn = 'sokeavtale-aktivitet';
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

const selector = formValueSelector(formNavn);
const mapStateToProps = (state, props) => {
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

export default connect(mapStateToProps)(
    injectIntl(BehandlingAktivitetReduxForm)
);
