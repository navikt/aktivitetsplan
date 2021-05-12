import useFormstate, { SubmitHandler } from '@nutgaard/use-formstate';
import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import SkjemaGruppe from 'nav-frontend-skjema/lib/skjema-gruppe';
import React, { useContext, useEffect } from 'react';

import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../../../constant';
import { Aktivitet, AktivitetStatus } from '../../../../datatypes/aktivitetTypes';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Radio from '../../../../felles-komponenter/skjema/input/Radio';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import visibleIf from '../../../../hocs/visible-if';
import { DirtyContext } from '../../../context/dirty-context';
import { trengerBegrunnelse } from '../../aktivitet-util';
import { kanOppdatereStatus, validateBegrunnelse } from './valideringUtils';

const VisibleAlertStripeSuksessSolid = visibleIf(AlertStripe);

const label = (status: AktivitetStatus) => {
    if (status === STATUS_FULLFOERT) {
        return 'Skriv en kort kommentar om hvordan det har gått med aktiviteten, eller noe NAV bør kjenne til.';
    }
    return 'Skriv en kort begrunnelse om hvorfor du avbryter aktiviteten.';
};

//Det er anbefalt at man bruker type er pga en known issue i use-formstate
export type ValideringsProps = {
    aktivitetstatus: string;
    begrunnelse: string;
    statusValidering: string;
};

type Handler = SubmitHandler<ValideringsProps>;

interface Props {
    aktivitet: Aktivitet;
    disabled: boolean;
    onSubmit: Handler;
}

const AktivitetStatusForm = (props: Props) => {
    const { aktivitet, onSubmit, disabled } = props;

    const validator = useFormstate<ValideringsProps, Aktivitet>({
        aktivitetstatus: () => undefined,
        begrunnelse: (val, values, valgtAktivitet) => validateBegrunnelse(val, values, valgtAktivitet),
        statusValidering: (val, values, validerStatusAktivitet) => kanOppdatereStatus(validerStatusAktivitet, values),
    });

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

    const status = state.fields.aktivitetstatus.input.value as AktivitetStatus;
    const visAdvarsel = status === STATUS_FULLFOERT || status === STATUS_AVBRUTT;
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
                        Hvis du endrer til "Fullført" eller "Avbrutt", blir aktiviteten låst og du kan ikke lenger endre
                        innholdet.
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
};

export default AktivitetStatusForm;
