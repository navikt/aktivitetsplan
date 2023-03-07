import { Alert, Button, RadioGroup } from '@navikt/ds-react';
import useFormstate, { SubmitHandler } from '@nutgaard/use-formstate';
import React, { useContext, useEffect } from 'react';

import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../../../constant';
import { AktivitetStatus } from '../../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Radio from '../../../../felles-komponenter/skjema/input/Radio';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import visibleIf from '../../../../hocs/visible-if';
import { DirtyContext } from '../../../context/dirty-context';
import { trengerBegrunnelse } from '../../aktivitet-util';
import { kanOppdatereStatus, validateBegrunnelse } from './valideringUtils';

const VisibleAlertStripeSuksessSolid = visibleIf(Alert);

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
};

type Handler = SubmitHandler<ValideringsProps>;

interface Props {
    aktivitet: VeilarbAktivitet;
    disabled: boolean;
    onSubmit: Handler;
}

const fields = [
    {
        value: STATUS_BRUKER_ER_INTRESSERT,
        label: 'Forslag',
    },
    {
        value: STATUS_PLANLAGT,
        label: 'Planlegger',
    },
    {
        value: STATUS_GJENNOMFOERT,
        label: 'Gjennomfører',
    },
    {
        value: STATUS_FULLFOERT,
        label: 'Fullført',
    },
    {
        value: STATUS_AVBRUTT,
        label: 'Avbrutt',
    },
];
const AktivitetStatusForm = (props: Props) => {
    const { aktivitet, onSubmit, disabled } = props;

    const validator = useFormstate<ValideringsProps, VeilarbAktivitet>({
        aktivitetstatus: (val, values, validerStatusAktivitet) => kanOppdatereStatus(validerStatusAktivitet, values),
        begrunnelse: (val, values, valgtAktivitet) => validateBegrunnelse(val, values, valgtAktivitet),
    });

    const initalValue = {
        aktivitetstatus: aktivitet.status || '',
        begrunnelse: aktivitet.avsluttetKommentar || '',
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

    const onChangeStatus = (value: AktivitetStatus) => {
        state.fields.aktivitetstatus.setValue(value);
    };

    return (
        <form onSubmit={state.onSubmit(onSubmit)}>
            <div>
                <RadioGroup
                    legend={null}
                    hideLegend
                    value={state.fields.aktivitetstatus.input.value}
                    onChange={onChangeStatus}
                    disabled={disabled}
                >
                    {fields.map(({ value, label }) => (
                        <Radio key={value} label={label} value={value} />
                    ))}
                </RadioGroup>
                <VisibleIfDiv className="status-alert" visible={!state.pristine}>
                    <VisibleAlertStripeSuksessSolid visible={visAdvarsel} variant="warning">
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
                {!!state.fields.aktivitetstatus.error ? (
                    <p className="font-bold text-red-700">{state.fields.aktivitetstatus.error}</p>
                ) : null}
            </div>
            <FormErrorSummary errors={state.errors} submittoken={state.submittoken} />
            <Button loading={state.submitting} className="mt-4" disabled={disabled}>
                Lagre
            </Button>
        </form>
    );
};

export default AktivitetStatusForm;
