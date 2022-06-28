import useFormstate from '@nutgaard/use-formstate';
import { Hovedknapp } from 'nav-frontend-knapper';
import SkjemaGruppe from 'nav-frontend-skjema/lib/skjema-gruppe';
import React, { useContext, useEffect } from 'react';

import * as konstanter from '../../../../constant';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import Radio from '../../../../felles-komponenter/skjema/input/Radio';
import { DirtyContext } from '../../../context/dirty-context';

interface Props {
    aktivitet: Aktivitet;
    disabled?: boolean;
    onSubmit(val: { soknadsstatus: string }): Promise<any>;
}

type FormType = {
    soknadsstatus: string;
};

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
            <SkjemaGruppe>
                <Radio
                    label="Venter på å bli kontaktet av NAV eller arbeidsgiver"
                    value={konstanter.VENTER}
                    disabled={disable}
                    {...state.fields.soknadsstatus}
                />
                <Radio
                    label="CV er delt med arbeidsgiver"
                    value={konstanter.CV_DELT}
                    disabled={disable}
                    {...state.fields.soknadsstatus}
                />
                <Radio
                    label="Skal på intervju"
                    value={konstanter.SKAL_PAA_INTERVJU}
                    disabled={disable}
                    {...state.fields.soknadsstatus}
                />
                <Radio
                    label="Fått jobbtilbud"
                    value={konstanter.JOBBTILBUD}
                    disabled={disable}
                    {...state.fields.soknadsstatus}
                />
                <Radio
                    label="Fått avslag"
                    value={konstanter.AVSLAG}
                    disabled={disable}
                    {...state.fields.soknadsstatus}
                />
            </SkjemaGruppe>
            <Hovedknapp className="oppdater-status" disabled={disable} spinner={state.submitting} autoDisableVedSpinner>
                Lagre
            </Hovedknapp>
        </form>
    );
};

export default SoknadsstatusForm;
