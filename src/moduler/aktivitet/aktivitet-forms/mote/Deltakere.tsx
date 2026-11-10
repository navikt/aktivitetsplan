import { ChevronDownIcon, PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import {
    ActionMenu,
    BodyShort,
    Button,
    ErrorMessage,
    Fieldset,
    HGrid,
    ReadMore,
    TextField,
    VStack,
} from '@navikt/ds-react';
import React, { useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import {
    MotedeltakerRolle,
    motedeltakerRoller,
    motedeltakerRolleTekst,
} from '../../../../datatypes/internAktivitetTypes';
import type { MoteAktivitetFormValuesInner } from './MoteAktivitetForm';
import { useErVeileder } from '../../../../Provider';
import Combobox from '@navikt/ds-react/src/form/combobox/Combobox';

interface Props {
    brukerNavn?: string;
    erMotedeltakereEnabled: boolean;
}

const Deltakere = ({ brukerNavn, erMotedeltakereEnabled }: Props) => {
    const erVeileder = useErVeileder();
    const {
        control,
        register,
        watch,
        setFocus,
        formState: { errors },
    } = useFormContext<MoteAktivitetFormValuesInner>();
    const { fields, append, remove } = useFieldArray({ control, name: 'deltakere' });
    const [status, setStatus] = useState('');
    const deltakere = watch('deltakere');

    if (!erMotedeltakereEnabled) return undefined;
    return (
        <Fieldset legend="Deltakere">
            <VStack gap="space-16">
                <HGrid columns={{ xs: 1, sm: 'minmax(0, 2fr) minmax(0, 1fr) auto' }} gap="space-16">
                    <TextField
                        label={<BodyShort as="span">Bruker</BodyShort>}
                        value={erVeileder ? (brukerNavn ?? 'Bruker') : 'Du'}
                        error={errors.root?.brukerNavn?.message}
                        readOnly
                    />
                </HGrid>
                {fields.map((field, index) => {
                    const navnId = `deltaker-navn-${field.id}`;
                    const rolleId = `deltakere.${index}.roller`;
                    const erVeileder = index === 0;
                    const erTolk = deltakere[index]?.roller.includes(MotedeltakerRolle.TOLK);
                    return (
                        <HGrid
                            key={field.id}
                            role="group"
                            aria-label={erVeileder ? 'Veileder' : `Deltaker ${index + 1}`}
                            columns={{ xs: 1, sm: 'minmax(0, 2fr) minmax(0, 1fr) auto' }}
                            gap="space-16"
                            align="start"
                        >
                            <div>
                                <TextField
                                    id={navnId}
                                    description="Fornavn Etternavn"
                                    label={
                                        <BodyShort as="span">{erVeileder ? 'Veileder' : 'Deltakers navn'}</BodyShort>
                                    }
                                    {...register(`deltakere.${index}.navn`)}
                                    error={errors.deltakere?.[index]?.navn?.message}
                                    aria-describedby={erTolk ? `${navnId}-info` : undefined}
                                />
                                <div id={`${navnId}-info`} aria-live="polite">
                                    {erTolk && (
                                        <BodyShort size="small">Navnet på tolk vises ikke for andre enn Nav.</BodyShort>
                                    )}
                                </div>
                            </div>
                                <>
                                    <Combobox
                                        label="Deltakers rolle"
                                        description="Velg en eller flere roller"
                                        options={motedeltakerRoller.map((rolle) => ({ label: rolle, value: rolle }))}
                                    >

                                    </Combobox>

                                    <Controller
                                        control={control}
                                        name={`deltakere.${index}.roller`}
                                        render={({ field: rolleField, fieldState }) => (
                                            <VStack gap="space-8">
                                                {fieldState.error && (
                                                    <ErrorMessage id={`${rolleId}-error`}>
                                                        {fieldState.error.message}
                                                    </ErrorMessage>
                                                )}
                                            </VStack>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="tertiary"
                                        data-color="danger"
                                        icon={<TrashIcon aria-hidden />}
                                        aria-label={`Fjern deltaker ${index + 1}`}
                                        className="sm:mt-8"
                                        onClick={() => {
                                            remove(index);
                                            setFocus(`deltakere.${index - 1}.navn`);
                                            setStatus(`Deltaker ${index + 1} fjernet`);
                                        }}
                                    />
                                </>
                            )
                        </HGrid>
                    );
                })}
                <div>
                    <Button
                        type="button"
                        variant="secondary"
                        icon={<PlusIcon aria-hidden />}
                        onClick={() => {
                            append({ navn: '', roller: [] }, { focusName: `deltakere.${fields.length}.navn` });
                            setStatus(`Deltaker ${fields.length + 1} lagt til`);
                        }}
                    >
                        Legg til flere deltakere
                    </Button>
                </div>
                <ReadMore header="Om tolk som deltaker" size="small">
                    Du kan trygt legge til tolk. Navnet på tolk vises ikke for andre enn Nav.
                </ReadMore>
                <div className="sr-only" role="status">
                    {status}
                </div>
            </VStack>
        </Fieldset>
    );
};

export default Deltakere;
