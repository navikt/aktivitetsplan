import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Innholdstittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import useFormstate from '@nutgaard/use-formstate';
import * as AppPT from '../../proptypes';
import Textarea from '../../felles-komponenter/skjema/input-v2/textarea';
import { hentPrintMelding } from './utskrift-selector';
import { lagrePrintMelding } from './utskrift-duck';
import { selectBruker } from '../bruker/bruker-selector';
import FormErrorSummary from '../../felles-komponenter/skjema/form-error-summary/form-error-summary';

const defaultBeskrivelse =
    'Her finner du avtalte aktiviteter med NAV som du skal gjennomføre for å nå målet ditt. ' +
    'Gi beskjed til NAV hvis det skjer endringer i situasjonen din eller hvis du ikke kan gjennomføre en aktivitet.';

function PrintMeldingForm(props) {
    const { beskrivelse, lagrer, bruker, onSubmit } = props;

    const validator = useFormstate({
        beskrivelse: val =>
            val.trim().length > 2000
                ? 'Du må korte ned teksten til 2000 tegn'
                : null,
    });

    const state = validator({
        beskrivelse: beskrivelse || defaultBeskrivelse,
    });

    return (
        <form
            onSubmit={state.onSubmit(onSubmit)}
            className="printmelding__form"
        >
            <div className="printmelding__skjema">
                <FormErrorSummary
                    submittoken={state.submittoken}
                    errors={state.errors}
                />

                <div className="printmelding__tittel">
                    <Innholdstittel>
                        {`Aktivitetsplan for ${bruker.fornavn}`}
                    </Innholdstittel>
                </div>

                <Textarea
                    label="Rediger teksten under så den passer til brukeren."
                    maxLength={2000}
                    visTellerFra={500}
                    {...state.fields.beskrivelse}
                />
            </div>
            <div className="printmelding__knapperad">
                <Hovedknapp spinner={lagrer} disabled={lagrer}>
                    Velg
                </Hovedknapp>
            </div>
        </form>
    );
}

PrintMeldingForm.propTypes = {
    onSubmit: PT.func.isRequired,
    lagrer: PT.bool,
    bruker: AppPT.motpart.isRequired,
    beskrivelse: PT.string,
};

PrintMeldingForm.defaultProps = {
    lagrer: false,
    beskrivelse: undefined,
};

const mapStateToProps = state => {
    const printMelding = hentPrintMelding(state);
    const bruker = selectBruker(state);
    return {
        beskrivelse: printMelding.beskrivelse,
        bruker,
    };
};

const mapDispatchToProps = dispatch => ({
    onSubmit: data => {
        dispatch(lagrePrintMelding(data));
        return Promise.resolve();
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(PrintMeldingForm);
