import React, { useContext, useEffect } from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import useFormstate from '@nutgaard/use-formstate';
import SkjemaGruppe from 'nav-frontend-skjema/lib/skjema-gruppe';
import * as konstanter from '../../../../constant';
import Radio from '../../../../felles-komponenter/skjema/input/radio';
import { DirtyContext } from '../../../context/dirty-context';
import { Aktivitet } from '../../../../types';

const validateEtikettStatus = (): string | undefined => undefined;

const validator = useFormstate({
    etikettstatus: validateEtikettStatus,
});

interface Props {
    aktivitet: Aktivitet;
    disabled?: boolean;
    onSubmit(): Promise<any>;
}

function StillingEtikettForm(props: Props) {
    const { aktivitet, disabled = true, onSubmit } = props;

    const state = validator({
        etikettstatus: aktivitet.etikett || konstanter.INGEN_VALGT,
    });

    const { setFormIsDirty } = useContext(DirtyContext);
    useEffect(() => {
        setFormIsDirty('etikett', !state.pristine);
        return () => {
            setFormIsDirty('etikett', false);
        };
    }, [setFormIsDirty, state.pristine]);

    const disable = state.submitting || disabled;

    return (
        <form onSubmit={state.onSubmit(onSubmit)}>
            <SkjemaGruppe>
                <Radio
                    label="Ikke startet"
                    value={konstanter.INGEN_VALGT}
                    disabled={disable}
                    {...state.fields.etikettstatus}
                />
                <Radio
                    label="Sendt søknad"
                    value={konstanter.SOKNAD_SENDT}
                    disabled={disable}
                    {...state.fields.etikettstatus}
                />
                <Radio
                    label="Skal på intervju"
                    value={konstanter.INNKALT_TIL_INTERVJU}
                    disabled={disable}
                    {...state.fields.etikettstatus}
                />
                <Radio
                    label="Fått jobbtilbud"
                    value={konstanter.JOBBTILBUD}
                    disabled={disable}
                    {...state.fields.etikettstatus}
                />
                <Radio
                    label="Fått avslag"
                    value={konstanter.AVSLAG}
                    disabled={disable}
                    {...state.fields.etikettstatus}
                />
            </SkjemaGruppe>
            <Hovedknapp className="oppdater-status" disabled={disable} spinner={state.submitting} autoDisableVedSpinner>
                Lagre
            </Hovedknapp>
        </form>
    );
}

export default StillingEtikettForm;
