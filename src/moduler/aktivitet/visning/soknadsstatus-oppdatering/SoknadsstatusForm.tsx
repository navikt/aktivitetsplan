import { Button } from '@navikt/ds-react';
import useFormstate from '@nutgaard/use-formstate';
import React, { useContext, useEffect } from 'react';

import * as konstanter from '../../../../constant';
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

    return (
        <form onSubmit={state.onSubmit(onSubmit)}>
            <div className="space-y-4 pb-4">
                {fields.map(({ label, value }) => (
                    <Radio key={value} value={value} label={label} />
                ))}
            </div>
            <Button className="oppdater-status" disabled={disable} loading={state.submitting}>
                Lagre
            </Button>
        </form>
    );
};

export default SoknadsstatusForm;
