import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { rules, validForm } from 'react-redux-form-validation';
import { OPPRETT_OPPGAVE_FORM } from './opprett-oppgave';
import Textarea from '../../../felles-komponenter/skjema/textarea/textarea';
import {
    begrensetBegrunnelseLengde,
    begrensetBeskrivelseLengde,
    BESKRIVELSE_MAKS_LENGDE,
    pakrevdBeskrivelse,
    temaValg,
} from './opprett-oppgave-utils';
import SelectMedTittel from './select-med-tittel';

function OpprettOppgaveForm({ handleSubmit, enhetliste }) {
    return (
        <form onSubmit={handleSubmit}>
            <SelectMedTittel
                tekstId="innstillinger.modal.opprett-oppgave.tema.tittel"
                keyValueObject={temaValg}
                fieldNavn="tema"
            />
            <SelectMedTittel
                tekstId="innstillinger.modal.opprett-oppgave.enhet.tittel"
                keyValueObject={enhetliste.reduce(
                    (acc, curr) => ({
                        ...acc,
                        [curr.enhetId]: `${curr.enhetId} ${curr.navn}`,
                    }),
                    {}
                )}
                fieldNavn="enhet"
            />

            <Textarea
                labelId="innstillinger.modal.opprett-oppgave.label.beskrivelse"
                feltNavn="beskrivelse"
                maxLength={BESKRIVELSE_MAKS_LENGDE}
            />
        </form>
    );
}

OpprettOppgaveForm.propTypes = {
    handleSubmit: PT.func.isRequired,
};

const OpprettOppgaveReduxForm = validForm({
    form: OPPRETT_OPPGAVE_FORM,
    validate: {
        beskrivelse: [begrensetBeskrivelseLengde, pakrevdBeskrivelse],
    },
})(OpprettOppgaveForm);

const mapStateToProps = (state, props) => ({
    form: props.formNavn,
    initialValues: {},
});

OpprettOppgaveReduxForm.defaultProps = {};

OpprettOppgaveReduxForm.propTypes = {};

export default connect(mapStateToProps)(OpprettOppgaveReduxForm);
