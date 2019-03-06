import React, { Component } from 'react';
import PT from 'prop-types';
import { formValueSelector, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { validForm } from 'react-redux-form-validation';
import { VIS_MALER } from '~config'; // eslint-disable-line
import { formNavn } from '../aktivitet-form-utils';
import { moment } from '../../../../utils';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import Input from '../../../../felles-komponenter/skjema/input/input';
import Datovelger from '../../../../felles-komponenter/skjema/datovelger/datovelger';
import {
    EGEN_AKTIVITET_TYPE,
    STATUS_BRUKER_ER_INTRESSERT,
} from '../../../../constant';
import PeriodeValidering from '../../../../felles-komponenter/skjema/datovelger/periode-validering';
import {
    maksLengde,
    pakrevd,
} from '../../../../felles-komponenter/skjema/validering';
import LagreAktivitet from '../lagre-aktivitet';
import AktivitetFormHeader from '../aktivitet-form-header';
import { selectValgtMalverkSlice } from '../../../malverk/malverk-selector';
import Malverk from '../../../malverk/malverk';

const TITTEL_MAKS_LENGDE = 255;
const HENSIKT_MAKS_LENGDE = 255;
const LENKE_MAKS_LENGDE = 2000;
const BESKRIVELSE_MAKS_LENGDE = 5000;
const OPPFOLGING_MAKS_LENGDE = 255;

function erAvtalt(verdi, props) {
    return !!props.avtalt;
}

const pakrevdTittel = pakrevd(
    'egen-aktivitet-form.feilmelding.paakrevd-tittel'
).hvisIkke(erAvtalt);

const begrensetTittelLengde = maksLengde(
    'egen-aktivitet-form.feilmelding.tittel-lengde',
    TITTEL_MAKS_LENGDE
).hvisIkke(erAvtalt);

const pakrevdFraDato = pakrevd(
    'egen-aktivitet-form.feilmelding.paakrevd-fradato'
).hvisIkke(erAvtalt);

const pakrevdTilDato = pakrevd(
    'egen-aktivitet-form.feilmelding.paakrevd-tildato'
);

const begrensetHensiktLengde = maksLengde(
    'egen-aktivitet-form.feilmelding.hensikt-lengde',
    HENSIKT_MAKS_LENGDE
).hvisIkke(erAvtalt);

const begrensetLenkeLengde = maksLengde(
    'egen-aktivitet-form.feilmelding.lenke-lengde',
    LENKE_MAKS_LENGDE
).hvisIkke(erAvtalt);

const begrensetBeskrivelseLengde = maksLengde(
    'egen-aktivitet-form.feilmelding.beskrivelse-lengde',
    BESKRIVELSE_MAKS_LENGDE
).hvisIkke(erAvtalt);

const begrensetoppfolginLengde = maksLengde(
    'egen-aktivitet-form.feilmelding.oppfolging-lengde',
    OPPFOLGING_MAKS_LENGDE
).hvisIkke(erAvtalt);

// TODO fiks i separat quickfix
// eslint-disable-next-line react/prefer-stateless-function
class EgenAktivitetForm extends Component {
    render() {
        const {
            currentFraDato,
            currentTilDato,
            handleSubmit,
            errorSummary,
            avtalt,
            endre,
        } = this.props;

        const erAktivitetAvtalt = avtalt === true;

        return (
            <form
                onSubmit={handleSubmit}
                noValidate="noValidate"
                autoComplete="off"
            >
                <div className="skjema-innlogget aktivitetskjema">
                    {errorSummary}

                    <AktivitetFormHeader
                        tittelId="egen-aktivitet-form.header"
                        pakrevdInfoId="aktivitet-form.pakrevd-felt-info"
                        ingressType={EGEN_AKTIVITET_TYPE}
                    />
                    <Malverk visible={VIS_MALER} endre={endre} type="EGEN" />
                    <Input
                        feltNavn="tittel"
                        disabled={erAktivitetAvtalt}
                        labelId="egen-aktivitet-form.label.overskrift"
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
                                labelId="egen-aktivitet-form.label.fra-dato"
                                senesteTom={currentTilDato}
                            />
                            <Datovelger
                                feltNavn="tilDato"
                                labelId="egen-aktivitet-form.label.til-dato"
                                tidligsteFom={currentFraDato}
                            />
                        </div>
                    </PeriodeValidering>

                    <Input
                        feltNavn="hensikt"
                        disabled={erAktivitetAvtalt}
                        labelId="egen-aktivitet-form.label.hensikt"
                        bredde="fullbredde"
                    />
                    <Textarea
                        feltNavn="beskrivelse"
                        disabled={erAktivitetAvtalt}
                        labelId="egen-aktivitet-form.label.beskrivelse"
                        maxLength={BESKRIVELSE_MAKS_LENGDE}
                        visTellerFra={500}
                    />
                    <Input
                        feltNavn="oppfolging"
                        disabled={erAktivitetAvtalt}
                        labelId="egen-aktivitet-form.label.oppfolging"
                        bredde="fullbredde"
                    />
                    <Input
                        feltNavn="lenke"
                        disabled={erAktivitetAvtalt}
                        labelId="egen-aktivitet-form.label.lenke"
                        bredde="fullbredde"
                    />
                </div>
                <LagreAktivitet />
            </form>
        );
    }
}

EgenAktivitetForm.propTypes = {
    handleSubmit: PT.func,
    errorSummary: PT.node.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date),
    avtalt: PT.bool,
    isDirty: PT.bool.isRequired,
    endre: PT.bool,
};

EgenAktivitetForm.defaultProps = {
    handleSubmit: undefined,
    currentFraDato: undefined,
    currentTilDato: undefined,
    avtalt: false,
    endre: false,
};

const EgenAktivitetReduxForm = validForm({
    form: formNavn,
    errorSummaryTitle: (
        <FormattedMessage id="egen-aktivitet-form.feiloppsummering-tittel" />
    ),
    enableReinitialize: true,
    validate: {
        tittel: [pakrevdTittel, begrensetTittelLengde],
        fraDato: [pakrevdFraDato],
        tilDato: [pakrevdTilDato],
        lenke: [begrensetLenkeLengde],
        hensikt: [begrensetHensiktLengde],
        beskrivelse: [begrensetBeskrivelseLengde],
        oppfolging: [begrensetoppfolginLengde],
        periodeValidering: [],
    },
})(EgenAktivitetForm);

const mapStateToProps = (state, props) => {
    const selector = formValueSelector(formNavn);
    const valgtMalverk = selectValgtMalverkSlice(state);
    const aktivitet = props.endre
        ? props.aktivitet
        : valgtMalverk || props.aktivitet || {};

    return {
        initialValues: {
            status: STATUS_BRUKER_ER_INTRESSERT,
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

export default connect(mapStateToProps)(EgenAktivitetReduxForm);
