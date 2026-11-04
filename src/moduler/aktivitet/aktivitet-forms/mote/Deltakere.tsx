import { ChevronDownIcon, PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import {
    ActionMenu,
    BodyShort,
    Button,
    ErrorMessage,
    Fieldset,
    HelpText,
    HGrid,
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

const Deltakere = () => {
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

    return (
        <Fieldset legend="Deltakere">
            <VStack gap="space-16">
                <HGrid columns={{ xs: 1, sm: 'minmax(0, 2fr) minmax(0, 1fr) auto' }} gap="space-16">
                    <TextField
                        label={<BodyShort as="span">Bruker</BodyShort>}
                        value={erVeileder ? 'Bruker' : 'Du'}
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
                            {!erVeileder && (
                                <>
                                    <Controller
                                        control={control}
                                        name={`deltakere.${index}.roller`}
                                        render={({ field: rolleField, fieldState }) => (
                                            <VStack gap="space-8">
                                                <BodyShort as="span" id={`${rolleId}-label`}>
                                                    Deltakers rolle
                                                </BodyShort>
                                                <ActionMenu>
                                                    <ActionMenu.Trigger>
                                                        <Button
                                                            ref={rolleField.ref}
                                                            id={rolleId}
                                                            type="button"
                                                            variant="secondary"
                                                            icon={<ChevronDownIcon aria-hidden />}
                                                            iconPosition="right"
                                                            aria-labelledby={`${rolleId}-label ${rolleId}`}
                                                            aria-invalid={!!fieldState.error}
                                                            aria-describedby={
                                                                fieldState.error ? `${rolleId}-error` : undefined
                                                            }
                                                            onBlur={rolleField.onBlur}
                                                            className="w-full justify-between"
                                                        >
                                                            {rolleField.value
                                                                .map((rolle) => motedeltakerRolleTekst[rolle])
                                                                .join(', ') || 'Velg'}
                                                        </Button>
                                                    </ActionMenu.Trigger>
                                                    <ActionMenu.Content>
                                                        <ActionMenu.Group aria-label="Deltakers rolle">
                                                            {motedeltakerRoller.map((rolle) => (
                                                                <ActionMenu.CheckboxItem
                                                                    key={rolle}
                                                                    checked={rolleField.value.includes(rolle)}
                                                                    onCheckedChange={(checked) =>
                                                                        rolleField.onChange(
                                                                            motedeltakerRoller.filter((valg) =>
                                                                                valg === rolle
                                                                                    ? checked
                                                                                    : rolleField.value.includes(valg),
                                                                            ),
                                                                        )
                                                                    }
                                                                >
                                                                    {motedeltakerRolleTekst[rolle]}
                                                                </ActionMenu.CheckboxItem>
                                                            ))}
                                                        </ActionMenu.Group>
                                                    </ActionMenu.Content>
                                                </ActionMenu>
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
                                        className="sm:mt-8"
                                        onClick={() => {
                                            remove(index);
                                            setFocus(`deltakere.${index - 1}.navn`);
                                            setStatus(`Deltaker ${index + 1} fjernet`);
                                        }}
                                    >
                                        Fjern <span className="sr-only">deltaker {index + 1}</span>
                                    </Button>
                                </>
                            )}
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
                <HelpText title="Om tolk som deltaker">
                    Du kan trygt legge til tolk. Navnet på tolk vises ikke for andre enn Nav.
                </HelpText>
                <div className="sr-only" role="status">
                    {status}
                </div>
            </VStack>
        </Fieldset>
    );
};

export default Deltakere;
