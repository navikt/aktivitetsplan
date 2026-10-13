import { zodResolver } from '@hookform/resolvers/zod';
import {
    Accordion,
    Alert,
    BodyLong,
    Button,
    Checkbox,
    CheckboxGroup,
    GuidePanel,
    Heading,
    List,
    Textarea,
} from '@navikt/ds-react';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { logKlikkKnapp } from '../../analytics/analytics';
import { AvsluttOppfolgingLayout } from './AvsluttOppfolgingLayout';
import { AvsluttOppfolgingKvittering } from './AvsluttOppfolgingKvittering';

const schema = z.object({
    bekreftet: z.boolean().refine((verdi) => verdi, 'Du må bekrefte før du kan avslutte oppfølgingen.'),
    begrunnelse: z.string().max(500, 'Du må korte ned teksten til 500 tegn'),
});
type AvsluttOppfolgingFormValues = z.infer<typeof schema>;

// TODO: Erstatt med kall mot veilarboppfolging når endepunktet finnes
const avsluttOppfolging = (_data: AvsluttOppfolgingFormValues): Promise<void> =>
    Promise.reject(new Error('Avslutt oppfølging er ikke implementert'));

export const AvsluttOppfolgingPage = () => {
    const [status, setStatus] = useState<'skjema' | 'vellykket' | 'feilet'>('skjema');
    const feilmeldingRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (status === 'feilet') feilmeldingRef.current?.focus();
    }, [status]);

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AvsluttOppfolgingFormValues>({
        defaultValues: { bekreftet: false, begrunnelse: '' },
        resolver: zodResolver(schema),
        shouldFocusError: true,
    });

    const begrunnelse = watch('begrunnelse'); // for <Textarea /> character-count to work

    const onSubmit = async (data: AvsluttOppfolgingFormValues) => {
        setStatus('skjema');
        try {
            await avsluttOppfolging(data);
            setStatus('vellykket');
        } catch {
            setStatus('feilet');
        }
    };

    if (status === 'vellykket') {
        return (
            <AvsluttOppfolgingLayout>
                <AvsluttOppfolgingKvittering />
            </AvsluttOppfolgingLayout>
        );
    }

    return (
        <AvsluttOppfolgingLayout visTilbakelenke>
            <GuidePanel poster>
                {/* TODO: Vis brukerens navn, f.eks. «Hei, Navn Navnesen!» */}
                <Heading level="2" size="medium" spacing>
                    Hei!
                </Heading>
                <BodyLong>
                    Du får arbeidsrettet oppfølging fra Nav. Med arbeidsrettet oppfølging kan du blant annet få:
                </BodyLong>
                <List>
                    <List.Item>Samtaler med veileder</List.Item>
                    <List.Item>Arbeidsrettede tiltak eller kurs</List.Item>
                    <List.Item>Veiledning og hjelp tilpasset din situasjon</List.Item>
                </List>
                <BodyLong weight="semibold">
                    Hvis du mener at du ikke lenger trenger denne oppfølgingen, kan du avslutte den nå.
                </BodyLong>
            </GuidePanel>
            <div>
                <Heading level="2" size="large" spacing>
                    Før du avslutter oppfølgingen din
                </Heading>
                <BodyLong spacing>
                    Når du melder deg av arbeidsrettet oppfølging, slutter Nav å hjelpe deg med å komme i jobb eller
                    beholde jobben din. Du har ikke lenger en veileder som følger deg opp. Nav vurderer heller ikke
                    lenger om du trenger tiltak, kurs eller annen støtte.
                </BodyLong>
                <BodyLong spacing>
                    Hvis situasjonen din endrer seg, kan du kontakte Nav og be om en ny vurdering.
                </BodyLong>
                <BodyLong spacing>Er du usikker på om du bør avslutte? Snakk med veilederen din først.</BodyLong>
                <Accordion className="mt-4">
                    <Accordion.Item defaultOpen>
                        <Accordion.Header>Informasjonen vi henter om deg</Accordion.Header>
                        <Accordion.Content>
                            {/* TODO: Endelig tekst */}
                            Her skal det stå informasjon om hvor vi vil hente opplysninger om søkeren og hva slags
                            opplysninger vi henter.
                        </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Header>Hvordan vi behandler personopplysninger</Accordion.Header>
                        <Accordion.Content>TODO: Endelig tekst</Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Header>Automatisk saksbehandling</Accordion.Header>
                        <Accordion.Content>TODO: Endelig tekst</Accordion.Content>
                    </Accordion.Item>
                </Accordion>
            </div>
            <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="bekreftet"
                    control={control}
                    render={({ field }) => (
                        <CheckboxGroup
                            legend="Bekreftelse"
                            hideLegend
                            value={field.value ? ['bekreftet'] : []}
                            onChange={(verdier: string[]) => field.onChange(verdier.includes('bekreftet'))}
                            error={errors.bekreftet?.message}
                        >
                            <Checkbox value="bekreftet" ref={field.ref}>
                                Jeg har satt meg inn i hva det innebærer å avslutte min arbeidsrettede oppfølging.
                            </Checkbox>
                        </CheckboxGroup>
                    )}
                />
                <Textarea
                    label="Fortell kort hvorfor du ikke lenger ønsker arbeidsrettet oppfølging (Valgfritt)"
                    maxLength={500}
                    {...register('begrunnelse')}
                    value={begrunnelse}
                    error={errors.begrunnelse?.message}
                    disabled={isSubmitting}
                    className="max-w-xs"
                />
                {status === 'feilet' && (
                    <Alert variant="error" ref={feilmeldingRef} tabIndex={-1}>
                        Noe gikk galt, og oppfølgingen ble ikke avsluttet. Prøv igjen senere.
                    </Alert>
                )}
                <div>
                    <Button
                        variant="primary"
                        className="max-w-[200px]"
                        loading={isSubmitting}
                        onClick={() => logKlikkKnapp('Avslutt arbeidsrettet oppfølging')}
                    >
                        Avslutt arbeidsrettet oppfølging
                    </Button>
                </div>
            </form>
        </AvsluttOppfolgingLayout>
    );
};
