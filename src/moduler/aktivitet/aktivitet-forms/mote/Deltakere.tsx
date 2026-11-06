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
import { useSelector } from 'react-redux';
import { selectFeature } from '../../../feature/feature-selector';

interface Props {
    brukerNavn?: string;
}

const Deltakere = ({ brukerNavn }: Props) => {
    const erMotedeltakereEnabled = useSelector(selectFeature('aktivitetsplan.enableMotedeltakere'));

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
                                                            className="w-full justify-between gap-1 px-2 text-left"
                                                        >
                                                            <BodyShort as="span" size="small">
                                                                {rolleField.value.length > 0
                                                                    ? rolleField.value.map((rolle, index) => (
                                                                          <React.Fragment key={rolle}>
                                                                              {index > 0 && ', '}
                                                                              <span className="whitespace-nowrap">
                                                                                  {motedeltakerRolleTekst[rolle]}
                                                                              </span>
                                                                          </React.Fragment>
                                                                      ))
                                                                    : 'Velg'}
                                                            </BodyShort>
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
