import React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import useFormstate from '@nutgaard/use-formstate';
import Textarea from '../../felles-komponenter/skjema/input/textarea';
import FormErrorSummary from '../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import { Bruker } from '../../types';

const defaultBeskrivelse =
    'Her finner du avtalte aktiviteter med NAV som du skal gjennomføre for å nå målet ditt. ' +
    'Gi beskjed til NAV hvis det skjer endringer i situasjonen din eller hvis du ikke kan gjennomføre en aktivitet.';

const validator = useFormstate({
    beskrivelse: val => (val.length > 2000 ? 'Du må korte ned teksten til 2000 tegn' : undefined)
});

interface Props {
    bruker: Bruker;
    onSubmit: (value: string) => Promise<any>;
    hidden?: boolean;
}

function PrintMeldingForm(props: Props) {
    const { bruker, onSubmit, hidden } = props;

    const state = validator({
        beskrivelse: defaultBeskrivelse
    });

    const submit = (form: { beskrivelse: string }) => {
        return onSubmit(form.beskrivelse);
    };

    return (
        <form onSubmit={state.onSubmit(submit)} className="printmelding__form" hidden={hidden}>
            <div className="printmelding__skjema">
                <FormErrorSummary submittoken={state.submittoken} errors={state.errors} />

                <div className="printmelding__tittel">
                    <Innholdstittel>{`Aktivitetsplan for ${bruker.fornavn}`}</Innholdstittel>
                </div>

                <Textarea
                    label="Rediger teksten under så den passer til brukeren."
                    maxLength={2000}
                    visTellerFra={500}
                    {...state.fields.beskrivelse}
                />
            </div>
            <div className="printmelding__knapperad">
                <Hovedknapp>Velg</Hovedknapp>
            </div>
        </form>
    );
}

export default PrintMeldingForm;
