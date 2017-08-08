import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import { validForm } from 'react-redux-form-validation';
import { Hovedknapp } from 'nav-frontend-knapper';
import { formNavn } from '../aktivitet-form-utils';
import VelgKanal from '../velg-kanal';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import Input from '../../../../felles-komponenter/skjema/input/input';
import Datovelger from '../../../../felles-komponenter/skjema/datovelger/datovelger';
import {
    SAMTALEREFERAT_TYPE,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_PLANLAGT,
    TELEFON_KANAL,
} from '../../../../constant';
import AktivitetIngress from '../../visning/aktivitetingress/aktivitetingress';
import {
    maksLengde,
    pakrevd,
} from '../../../../felles-komponenter/skjema/validering';
import { dateToISODate } from '../../../../utils';

const TITTEL_MAKS_LENGDE = 255;
const REFERAT_MAKS_LENGDE = 5000;

const pakrevdTittel = pakrevd('samtalereferat-form.feilmelding.pakrevd-tittel');
const begrensetTittelLengde = maksLengde(
    'samtalereferat-form.feilmelding.tittel-lengde',
    TITTEL_MAKS_LENGDE
);
const pakrevdFraDato = pakrevd('samtalereferat-form.feilmelding.pakrevd-dato');
const begrensetReferatLengde = maksLengde(
    'samtalereferat-form.feilmelding.referat-lengde',
    REFERAT_MAKS_LENGDE
);
const pakrevdKanal = pakrevd('samtalereferat-form.feilmelding.pakrevd-kanal');

const pakrevdReferat = pakrevd(
    'samtalereferat-form.feilmelding.pakrevd-referat'
);

function MoteAktivitetForm({ handleSubmit, errorSummary, lagrer }) {
    return (
        <form onSubmit={handleSubmit}>
            <div className="skjema-innlogget aktivitetskjema">
                {errorSummary}

                <div className="aktivitetskjema__header">
                    <Innholdstittel>
                        <FormattedMessage id="samtalereferat-form.header" />
                    </Innholdstittel>
                    <Undertekst>
                        <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                    </Undertekst>
                </div>

                <AktivitetIngress type={SAMTALEREFERAT_TYPE} />

                <Input
                    feltNavn="tittel"
                    labelId="samtalereferat-form.label.overskrift"
                    bredde="fullbredde"
                />

                <Datovelger
                    feltNavn="fraDato"
                    labelId="samtalereferat-form.label.dato"
                />

                <VelgKanal labelId="samtalereferat-form.label.kanal" />

                <Textarea
                    feltNavn="referat"
                    labelId="samtalereferat-form.label.referat"
                    placeholderId="samtalereferat-form.placeholder.referat"
                    maxLength={REFERAT_MAKS_LENGDE}
                />
            </div>
            <div className="aktivitetskjema__lagre-knapp">
                <Hovedknapp spinner={lagrer} disabled={lagrer}>
                    <FormattedMessage id="aktivitet-form.lagre" />
                </Hovedknapp>
            </div>
        </form>
    );
}

MoteAktivitetForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    errorSummary: PT.node.isRequired,
    lagrer: PT.bool.isRequired,
};

const MoteAktivitetReduxForm = validForm({
    form: formNavn,
    errorSummaryTitle: (
        <FormattedMessage id="samtalereferat-form.feiloppsummering-tittel" />
    ),
    validate: {
        tittel: [pakrevdTittel, begrensetTittelLengde],
        fraDato: [pakrevdFraDato],
        kanal: [pakrevdKanal],
        referat: [pakrevdReferat, begrensetReferatLengde],
    },
})(MoteAktivitetForm);

const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: STATUS_PLANLAGT,
            fraDato: dateToISODate(new Date()),
            avtalt: true,
            kanal: TELEFON_KANAL,
            ...aktivitet,
        },
    };
};

export default connect(mapStateToProps)(MoteAktivitetReduxForm);
