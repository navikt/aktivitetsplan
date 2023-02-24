import { Button, RadioGroup } from '@navikt/ds-react';
import useFormstate from '@nutgaard/use-formstate';
import React, { useContext, useEffect } from 'react';

import * as konstanter from '../../../../constant';
import { StillingsStatus } from '../../../../datatypes/aktivitetTypes';
import { StillingAktivitet } from '../../../../datatypes/internAktivitetTypes';
import Radio from '../../../../felles-komponenter/skjema/input/Radio';
import { DirtyContext } from '../../../context/dirty-context';

const validateEtikettStatus = (): string | undefined => undefined;

interface Props {
    aktivitet: StillingAktivitet;
    disabled?: boolean;
    onSubmit(val: { etikettstatus: string }): Promise<any>;
}

type FormType = {
    etikettstatus: string;
};
const fields = [
    {
        label: 'Ikke startet',
        value: konstanter.INGEN_VALGT,
    },
    {
        label: 'Sendt søknad og venter på svar',
        value: konstanter.SOKNAD_SENDT,
    },
    {
        label: 'Skal på intervju',
        value: konstanter.INNKALT_TIL_INTERVJU,
    },
    {
        label: 'Fått jobbtilbud',
        value: konstanter.JOBBTILBUD,
    },
    {
        label: 'Ikke fått jobben',
        value: konstanter.AVSLAG,
    },
];

const StillingEtikettForm = (props: Props) => {
    const { aktivitet, disabled = true, onSubmit } = props;

    const validator = useFormstate<FormType>({
        etikettstatus: validateEtikettStatus,
    });

    const state = validator({
        etikettstatus: aktivitet.etikett || konstanter.INGEN_VALGT,
    });

    const { setFormIsDirty } = useContext(DirtyContext);
    useEffect(() => {
        setFormIsDirty('etikett', !state.pristine);
    }, [setFormIsDirty, state.pristine]);

    const disable = state.submitting || disabled;

    const onChangeStillingStatus = (value: StillingsStatus) => {
        state.fields.etikettstatus.setValue(value);
    };

    return (
        <form onSubmit={state.onSubmit(onSubmit)}>
            <div className="mb-4">
                <RadioGroup
                    legend={''}
                    value={state.fields.etikettstatus.input.value}
                    onChange={onChangeStillingStatus}
                >
                    {fields.map(({ value, label }) => (
                        <Radio key={value} value={value} label={label} disabled={disable} />
                    ))}
                </RadioGroup>
            </div>
            <Button className="oppdater-status" disabled={disable} loading={state.submitting}>
                Lagre
            </Button>
        </form>
    );
};

export default StillingEtikettForm;
