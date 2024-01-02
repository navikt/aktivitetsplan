import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';

import { StillingStatus } from '../../../../datatypes/aktivitetTypes';
import { StillingAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { DirtyContext } from '../../../context/dirty-context';
import { selectOppdaterAktivitetEtikettFeil } from '../../../feilmelding/feil-selector';
import Feilmelding from '../../../feilmelding/Feilmelding';

interface Props {
    aktivitet: StillingAktivitet;
    disabled: boolean;
    onSubmit(val: StillingEtikettFormValues): Promise<any>;
}

const schema = z.object({
    etikettstatus: z.nativeEnum(StillingStatus),
});

export type StillingEtikettFormValues = z.infer<typeof schema>;

const RadioButtons: Record<StillingStatus, string> = {
    INGEN_VALGT: 'Ikke startet',
    SOKNAD_SENDT: 'Sendt søknad',
    INNKALT_TIL_INTERVJU: 'Skal på intervju',
    JOBBTILBUD: 'Fått jobbtilbud',
    AVSLAG: 'Ikke fått jobben',
};

const StillingEtikettForm = (props: Props) => {
    const { aktivitet, disabled, onSubmit } = props;

    const defaultValues: StillingEtikettFormValues = {
        etikettstatus: aktivitet.etikett || StillingStatus.INGEN_VALGT,
    };

    const {
        handleSubmit,
        setValue,
        formState: { isDirty, isSubmitting },
    } = useForm<StillingEtikettFormValues>({ defaultValues, resolver: zodResolver(schema), shouldFocusError: true });

    const { setFormIsDirty } = useContext(DirtyContext);
    useEffect(() => {
        setFormIsDirty('etikett', isDirty);
    }, [setFormIsDirty, isDirty]);

    const disable = isSubmitting || disabled;

    const onChangeStillingStatus = (value: StillingStatus) => {
        setValue('etikettstatus', value);
    };

    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
            <div className="mb-4">
                <RadioGroup
                    legend={'Hvor langt har du kommet i søknadsprosessen?'}
                    hideLegend
                    defaultValue={defaultValues.etikettstatus}
                    onChange={onChangeStillingStatus}
                    disabled={disable}
                >
                    {Object.entries(RadioButtons).map(([key, value]) => (
                        <Radio key={key} value={key}>
                            {value}
                        </Radio>
                    ))}
                </RadioGroup>
            </div>
            <Feilmelding feilmeldinger={useSelector(selectOppdaterAktivitetEtikettFeil)} />
            <Button className="oppdater-status" disabled={disable} loading={isSubmitting}>
                Lagre
            </Button>
        </form>
    );
};

export default StillingEtikettForm;
