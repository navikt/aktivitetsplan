import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import { validForm } from 'react-redux-form-validation';
import { Hovedknapp } from 'nav-frontend-knapper';
import { formNavn } from '../aktivitet/aktivitet-forms/aktivitet-form-utils';
import * as AppPT from '../../proptypes';
import { storeForbokstaver } from '../../utils';
import {
    maksLengde,
    pakrevd,
} from '../../felles-komponenter/skjema/validering';
import Textarea from '../../felles-komponenter/skjema/textarea/textarea';
import Input from '../../felles-komponenter/skjema/input/input';
import { hentPrintMelding } from './utskrift-selector';
import { lagrePrintMelding } from './utskrift-duck';
import { selectBruker } from '../bruker/bruker-selector';

const OVERSKRIFT_MAKS_LENGDE = 255;
const BESKRIVELSE_MAKS_LENGDE = 2000;

const pakrevdOverskrift = pakrevd(
    'print-melding-form.feilmelding.pakrevd-overskrift'
);
const begrensetOverskriftLengde = maksLengde(
    'print-melding-form.feilmelding.overskrift-lengde',
    OVERSKRIFT_MAKS_LENGDE
);
const begrensetBeskrivelseLengde = maksLengde(
    'print-melding-form.feilmelding.beskrivelse-lengde',
    BESKRIVELSE_MAKS_LENGDE
);

function PrintMeldingForm({ errorSummary, handleSubmit, lagrer, bruker }) {
    return (
        <form onSubmit={handleSubmit} className="printmelding__form">
            <div className="printmelding__skjema">
                {errorSummary}

                <div className="printmelding__tittel">
                    <Innholdstittel>
                        <FormattedMessage
                            id="print-melding-form.header"
                            values={{
                                FORNAVN: storeForbokstaver(bruker.fornavn),
                            }}
                        />
                    </Innholdstittel>
                    <Undertekst>
                        <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                    </Undertekst>
                </div>

                <Input
                    feltNavn="overskrift"
                    labelId="print-melding-form.label.overskrift"
                    bredde="fullbredde"
                />

                <Textarea
                    feltNavn="beskrivelse"
                    labelId="print-melding-form.label.beskrivelse"
                    maxLength={BESKRIVELSE_MAKS_LENGDE}
                />
            </div>
            <div className="printmelding__knapperad">
                <Hovedknapp spinner={lagrer} disabled={lagrer}>
                    <FormattedMessage id="print-melding-form.lagre" />
                </Hovedknapp>
            </div>
        </form>
    );
}

PrintMeldingForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    errorSummary: PT.node.isRequired,
    lagrer: PT.bool,
    bruker: AppPT.motpart.isRequired,
    intl: intlShape.isRequired,
};

PrintMeldingForm.defaultProps = {
    lagrer: false,
};

const PrintMeldingReduxForm = validForm({
    form: formNavn,
    errorSummaryTitle: (
        <FormattedMessage id="print-melding-form.feiloppsummering-tittel" />
    ),
    validate: {
        overskrift: [pakrevdOverskrift, begrensetOverskriftLengde],
        beskrivelse: [begrensetBeskrivelseLengde],
    },
})(PrintMeldingForm);

const mapStateToProps = (state, props) => {
    const printMelding = hentPrintMelding(state);
    const bruker = selectBruker(state);
    return {
        initialValues: {
            beskrivelse: props.intl.formatMessage({
                id: 'print-melding-form.beskrivelse-standardtekst',
            }),
            ...printMelding,
        },
        bruker,
    };
};

const mapDispatchToProps = dispatch => ({
    onSubmit: data => {
        dispatch(lagrePrintMelding(data));
    },
});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(PrintMeldingReduxForm)
);
