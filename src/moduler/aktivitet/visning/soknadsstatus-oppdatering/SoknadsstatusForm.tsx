import { Button, RadioGroup } from '@navikt/ds-react';
import useFormstate from '@nutgaard/use-formstate';
import React, { useContext, useEffect } from 'react';

import * as konstanter from '../../../../constant';
import { StillingFraNavSoknadsstatus } from '../../../../datatypes/aktivitetTypes';
import { StillingFraNavAktivitet } from '../../../../datatypes/internAktivitetTypes';
import Radio from '../../../../felles-komponenter/skjema/input/Radio';
import { DirtyContext } from '../../../context/dirty-context';

interface Props {
    aktivitet: StillingFraNavAktivitet;
    disabled?: boolean;
    onSubmit(val: { soknadsstatus: string }): Promise<any>;
}

type FormType = {
    soknadsstatus: string;
};

const fields = [
    {
        label: 'Venter på å bli kontaktet av NAV eller arbeidsgiver',
        value: konstanter.VENTER,
    },
    {
        label: 'CV er delt med arbeidsgiver',
        value: konstanter.CV_DELT,
    },
    {
        label: 'Skal på intervju',
        value: konstanter.SKAL_PAA_INTERVJU,
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

const SoknadsstatusForm = (props: Props) => {
    const { aktivitet, disabled = true, onSubmit } = props;

    const validator = useFormstate<FormType>({
        soknadsstatus: () => undefined,
    });

    const initialValue = {
        soknadsstatus: aktivitet.stillingFraNavData?.soknadsstatus || '',
    };

    const state = validator(initialValue);

    const { setFormIsDirty } = useContext(DirtyContext);

    useEffect(() => {
        setFormIsDirty('soknadsstatus', !state.pristine);
        return () => {
            setFormIsDirty('soknadsstatus', false);
        };
    }, [setFormIsDirty, state.pristine]);

    const disable = state.submitting || disabled;

    const onChangeSoknadStatus = (value: StillingFraNavSoknadsstatus) => {
        state.fields.soknadsstatus.setValue(value);
    };

    return (
        <form onSubmit={state.onSubmit(onSubmit)}>
            <div className="pb-4">
                <RadioGroup legend={''} value={state.fields.soknadsstatus.input.value} onChange={onChangeSoknadStatus}>
                    {fields.map(({ label, value }) => (
                        <Radio key={value} value={value} label={label} />
                    ))}
                </RadioGroup>
            </div>
            <Button className="oppdater-status" disabled={disable} loading={state.submitting}>
                Lagre
            </Button>
        </form>
    );
};

export default SoknadsstatusForm;
