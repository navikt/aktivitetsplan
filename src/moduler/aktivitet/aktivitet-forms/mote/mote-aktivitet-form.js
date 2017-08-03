import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import { validForm } from 'react-redux-form-validation';
import { Hovedknapp } from 'nav-frontend-knapper';
import { formNavn } from '../aktivitet-form-utils';
import {
    maksLengde,
    pakrevd,
} from '../../../../felles-komponenter/skjema/validering';
import Textarea from '../../../../felles-komponenter/skjema/textarea/textarea';
import Input from '../../../../felles-komponenter/skjema/input/input';
import Select from '../../../../felles-komponenter/skjema/input/select';
import Datovelger from '../../../../felles-komponenter/skjema/datovelger/datovelger';
import VelgKanal from '../velg-kanal';
import { MOTE_TYPE, STATUS_PLANLAGT } from '../../../../constant';
import AktivitetIngress from '../../visning/aktivitetingress/aktivitetingress';
import {
    beregnFraTil,
    beregnKlokkeslettVarighet,
    formatterKlokkeslett,
    formatterVarighet,
} from '../../aktivitet-util';

const TITTEL_MAKS_LENGDE = 255;
const BESKRIVELSE_MAKS_LENGDE = 2000;
const FORBEREDELSER_MAKS_LENGDE = 2000;

const pakrevdTittel = pakrevd('mote-aktivitet-form.feilmelding.pakrevd-tittel');
const begrensetTittelLengde = maksLengde(
    'mote-aktivitet-form.feilmelding.tittel-lengde',
    TITTEL_MAKS_LENGDE
);
const pakrevdFraDato = pakrevd('mote-aktivitet-form.feilmelding.pakrevd-dato');
const pakrevdVarighet = pakrevd(
    'mote-aktivitet-form.feilmelding.pakrevd-varighet'
);
const pakrevdKlokkeslett = pakrevd(
    'mote-aktivitet-form.feilmelding.pakrevd-klokkeslett'
);
const begrensetBeskrivelseLengde = maksLengde(
    'mote-aktivitet-form.feilmelding.beskrivelse-lengde',
    BESKRIVELSE_MAKS_LENGDE
);
const begrensetForberedelserLengde = maksLengde(
    'mote-aktivitet-form.feilmelding.forberedelser-lengde',
    FORBEREDELSER_MAKS_LENGDE
);

const tidspunkter = Array.from(new Array(53)).map((noValue, index) => {
    const minutter = index * 15 + 7 * 60;
    return (
        <option key={minutter} value={minutter} dir="rtl">
            {formatterKlokkeslett(minutter)}
        </option>
    );
});

const varigheter = Array.from(new Array(24)).map((noValue, index) => {
    const minutter = (index + 1) * 15;
    return (
        <option key={minutter} value={minutter}>
            {formatterVarighet(minutter)}
        </option>
    );
});

function MoteAktivitetForm({ erAvtalt, errorSummary, handleSubmit, lagrer }) {
    return (
        <form onSubmit={handleSubmit}>
            <div className="skjema-innlogget aktivitetskjema">
                {errorSummary}

                <div className="aktivitetskjema__header">
                    <Innholdstittel>
                        <FormattedMessage id="mote-aktivitet-form.header" />
                    </Innholdstittel>
                    <Undertekst>
                        <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                    </Undertekst>
                </div>

                <AktivitetIngress type={MOTE_TYPE} />

                <Input
                    feltNavn="tittel"
                    disabled={erAvtalt}
                    labelId="mote-aktivitet-form.label.overskrift"
                    bredde="fullbredde"
                />

                <div className="mote-aktivitet-form__velg-mote-klokkeslett">
                    <Datovelger
                        feltNavn="dato"
                        labelId="mote-aktivitet-form.label.dato"
                    />

                    <Select
                        feltNavn="klokkeslett"
                        labelId="mote-aktivitet-form.label.klokkeslett"
                        bredde="xs"
                    >
                        {tidspunkter}
                    </Select>

                    <Select
                        feltNavn="varighet"
                        labelId="mote-aktivitet-form.label.varighet"
                        bredde="xs"
                    >
                        {varigheter}
                    </Select>
                </div>

                <VelgKanal
                    disabled={erAvtalt}
                    labelId="mote-aktivitet-form.label.kanal"
                />

                <Input
                    feltNavn="adresse"
                    labelId="mote-aktivitet-form.label.adresse"
                    bredde="fullbredde"
                />
                <Textarea
                    feltNavn="beskrivelse"
                    disabled={erAvtalt}
                    labelId="mote-aktivitet-form.label.bakgrunn"
                    maxLength={BESKRIVELSE_MAKS_LENGDE}
                />
                <Textarea
                    feltNavn="forberedelser"
                    disabled={erAvtalt}
                    labelId="mote-aktivitet-form.label.forberedelser"
                    maxLength={FORBEREDELSER_MAKS_LENGDE}
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
    erAvtalt: PT.bool,
};

MoteAktivitetForm.defaultProps = {
    erAvtalt: false,
};

const MoteAktivitetReduxForm = validForm({
    form: formNavn,
    errorSummaryTitle: (
        <FormattedMessage id="mote-aktivitet-form.feiloppsummering-tittel" />
    ),
    validate: {
        tittel: [pakrevdTittel, begrensetTittelLengde],
        dato: [pakrevdFraDato],
        varighet: [pakrevdVarighet],
        klokkeslett: [pakrevdKlokkeslett],
        beskrivelse: [begrensetBeskrivelseLengde],
        forberedelser: [begrensetForberedelserLengde],
    },
})(MoteAktivitetForm);

const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: STATUS_PLANLAGT,
            ...aktivitet,
            ...beregnKlokkeslettVarighet(aktivitet),
        },
        erAvtalt: aktivitet && aktivitet.avtalt === true,
        ...props,
        onSubmit: data =>
            props.onSubmit({
                ...data,
                ...beregnFraTil(data),
            }),
    };
};

export default connect(mapStateToProps)(MoteAktivitetReduxForm);
