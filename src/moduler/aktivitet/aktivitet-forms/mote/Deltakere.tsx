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
import { UNSAFE_Combobox as Combobox } from '@navikt/ds-react';

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
                <HGrid columns={{ xs: 1, sm: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.2fr)' }} gap="space-16">
                    <TextField
                        size="small"
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
                            columns={{ xs: 1, sm: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.2fr)' }}
                            gap="space-16"
                            align="end"
                        >
                            <div>
                                <TextField
                                    id={navnId}
                                    size="small"
                                    label={
                                        <BodyShort as="span">{erVeileder ? 'Veileder' : 'Deltakers navn'}</BodyShort>
                                    }
                                    description={
                                        <BodyShort as="span" size="small">Fornavn Etternavn</BodyShort>
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
                                            <Combobox
                                                id={rolleId}
                                                error={fieldState.error?.message}
                                                size="small"
                                                label={
                                                    <BodyShort as="span">Deltakers rolle</BodyShort>
                                                }
                                                isMultiSelect
                                                description={
                                                    <BodyShort as="span" size="small">Velg en eller flere</BodyShort>
                                                }
                                                options={motedeltakerRoller}
                                                selectedOptions={motedeltakerRoller.filter((option) =>
                                                    rolleField.value.includes(option.value),
                                                )}
                                                onToggleSelected={(value, isSelected) => {
                                                    const rolle = motedeltakerRoller.find(
                                                        (option) => option.value === value,
                                                    )?.value;
                                                    if (!rolle) return;
                                                    rolleField.onChange(
                                                        isSelected
                                                            ? [...rolleField.value, rolle]
                                                            : rolleField.value.filter((r) => r !== rolle),
                                                    );
                                                }}
                                                onBlur={rolleField.onBlur}
                                                ref={rolleField.ref}
                                            />
                                        </VStack>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="tertiary"
                                    size="small"
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
                            )}
                        </HGrid>
                    );
                })}
                <div>
                    <Button
                        type="button"
                        size="small"
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
