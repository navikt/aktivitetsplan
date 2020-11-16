import useFormstate from '@nutgaard/use-formstate';
import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import SkjemaGruppe from 'nav-frontend-skjema/lib/skjema-gruppe';
import PT from 'prop-types';
import React, { useContext, useEffect } from 'react';

import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../../../constant';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Radio from '../../../../felles-komponenter/skjema/input/radio';
import Textarea from '../../../../felles-komponenter/skjema/input/textarea';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import visibleIf from '../../../../hocs/visible-if';
import { aktivitet as aktivitetPT } from '../../../../proptypes';
import { DirtyContext } from '../../../context/dirty-context';
import { manglerPubliseringAvSamtaleReferat, trengerBegrunnelse } from '../../aktivitet-util';

const VisibleAlertStripeSuksessSolid = visibleIf(AlertStripe);

function statusKreverInformasjonMelding(status) {
    return status === STATUS_FULLFOERT || status === STATUS_AVBRUTT;
}

function label(status) {
    if (status === STATUS_FULLFOERT) {
        return 'Skriv en kort kommentar om hvordan det har gått med aktiviteten, eller noe NAV bør kjenne til.';
    }
    return 'Skriv en kort begrunnelse om hvorfor du avbrøt aktiviteten. Etter at du har trykket på "Bekreft", må du gi beskjed til veilederen din ved å starte en dialog her i aktivitetsplanen.';
}

function kanOppdatereStatus(aktivitet, values) {
    const status = values.aktivitetstatus;
    const ferdigStatus = [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(status);
    const ferdigOgManglerPubliseringAvSamtaleReferat =
        ferdigStatus && manglerPubliseringAvSamtaleReferat(aktivitet || {}, status);

    if (ferdigOgManglerPubliseringAvSamtaleReferat) {
        return 'Samtalereferatet må deles før du kan sette aktiviteten til denne statusen';
    }

    return null;
}

function validateBegrunnelse(value, values, aktivitet) {
    const status = values.aktivitetstatus;
    if (trengerBegrunnelse(aktivitet.avtalt, status, aktivitet.type) && value.trim().length === 0) {
        return 'Du må fylle ut en begrunnelse';
    }
    if (value.length > 255) {
        return 'Du må korte ned teksten til 255 tegn';
    }
    return null;
}

const validator = useFormstate({
    aktivitetstatus: () => {},
    begrunnelse: (val, values, aktivitet) => validateBegrunnelse(val, values, aktivitet),
    statusValidering: (val, values, aktivitet) => kanOppdatereStatus(aktivitet, values),
});

function AktivitetStatusForm(props) {
    const { aktivitet, onSubmit, disabled } = props;

    const initalValue = {
        aktivitetstatus: aktivitet.status || '',
        begrunnelse: aktivitet.avsluttetBegrunnelse || '',
        statusValidering: '',
    };

    const state = validator(initalValue, aktivitet);

    const { setFormIsDirty } = useContext(DirtyContext);
    useEffect(() => {
        setFormIsDirty('status', !state.pristine);
        return () => {
            setFormIsDirty('status', false);
        };
    }, [setFormIsDirty, state.pristine]);

    const status = state.fields.aktivitetstatus.input.value;
    const visAdvarsel = statusKreverInformasjonMelding(status);
    const visBegrunnelseFelt = trengerBegrunnelse(aktivitet.avtalt, status, aktivitet.type);

    return (
        <form onSubmit={state.onSubmit(onSubmit)}>
            <SkjemaGruppe feil={state.fields.statusValidering.error}>
                <Radio
                    label="Forslag"
                    value={STATUS_BRUKER_ER_INTRESSERT}
                    disabled={disabled}
                    {...state.fields.aktivitetstatus}
                />
                <Radio
                    label="Planlegger"
                    value={STATUS_PLANLAGT}
                    disabled={disabled}
                    {...state.fields.aktivitetstatus}
                />
                <Radio
                    label="Gjennomfører"
                    value={STATUS_GJENNOMFOERT}
                    disabled={disabled}
                    {...state.fields.aktivitetstatus}
                />
                <Radio
                    label="Fullført"
                    value={STATUS_FULLFOERT}
                    disabled={disabled}
                    {...state.fields.aktivitetstatus}
                />
                <Radio label="Avbrutt" value={STATUS_AVBRUTT} disabled={disabled} {...state.fields.aktivitetstatus} />

                <VisibleIfDiv className="status-alert" visible={!state.pristine}>
                    <VisibleAlertStripeSuksessSolid visible={visAdvarsel} type="advarsel">
                        {
                            'Hvis du endrer til "Fullført" eller "Avbrutt", blir aktiviteten låst og du kan ikke lenger endre innholdet.'
                        }
                    </VisibleAlertStripeSuksessSolid>

                    <VisibleIfDiv visible={visBegrunnelseFelt}>
                        <Textarea
                            label={label(status)}
                            maxLength={255}
                            disabled={disabled}
                            {...state.fields.begrunnelse}
                        />
                    </VisibleIfDiv>
                </VisibleIfDiv>
            </SkjemaGruppe>
            <FormErrorSummary errors={state.errors} submittoken={state.submittoken} />
            <Hovedknapp
                spinner={state.submitting}
                autoDisableVedSpinner
                className="oppdater-status"
                disabled={disabled}
            >
                Lagre
            </Hovedknapp>
        </form>
    );
}

AktivitetStatusForm.propTypes = {
    disabled: PT.bool.isRequired,
    onSubmit: PT.func.isRequired,
    aktivitet: aktivitetPT.isRequired,
};

export default AktivitetStatusForm;
