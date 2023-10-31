import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, BodyShort, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { endOfToday, parseISO, startOfDay, subDays } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { ZodErrorMap, z } from 'zod';

import { StillingFraNavAktivitet } from '../../../../datatypes/internAktivitetTypes';
import useAppDispatch from '../../../../felles-komponenter/hooks/useAppDispatch';
import { useErVeileder } from '../../../../Provider';
import { formaterDatoManed } from '../../../../utils/dateUtils';
import { selectDeleCVFeil } from '../../../feilmelding/feil-selector';
import Feilmelding from '../../../feilmelding/Feilmelding';
import { oppdaterCVSvar } from '../../aktivitet-actions';
import CustomErrorSummary from '../../aktivitet-forms/CustomErrorSummary';
import { Ingress } from './DeleCvContainer';
import { SvarPaaVegneAvBruker } from './SvarPaaVegneAvBruker';
import { JaSvarTekst, NeiSvarTekst, overskrift } from './tekster';

enum SvarType {
    JA = 'ja',
    NEI = 'nei',
}

interface PropTypes {
    aktivitet: StillingFraNavAktivitet;
}

type KanDeles = {
    kanDeles: string;
    avtaltDato: string;
};

const dateErrorMap = {
    invalid_type: 'Du må fylle ut datoen for når du var i dialog med brukeren',
    invalid_date: 'Ikke en gyldig dato',
};
const getDateErrorMessage: ZodErrorMap = (issue) => {
    return {
        message: dateErrorMap[issue.code],
    };
};

const kanDelesField = z.nativeEnum(SvarType, {
    required_error: 'Du må svare ja eller nei',
    invalid_type_error: 'Ikke en gyldig dato',
});
const getSchema = ({ after: disabledAfter }: { after: Date }, erVeileder: boolean) => {
    if (erVeileder) {
        return z.object({
            kanDeles: kanDelesField,
            avtaltDato: z
                .date({
                    errorMap: getDateErrorMessage,
                })
                .max(disabledAfter, { message: 'Dato for dialog kan ikke være frem i tid' }),
        });
    }
    return z.object({
        kanDeles: kanDelesField,
    });
};

export const MeldInteresseForStilling = ({ aktivitet }: PropTypes) => {
    const [infoTekst, setInfoTekst] = useState<string | undefined>(undefined);
    const dispatch = useAppDispatch();

    const erVeileder = useErVeileder();
    const svarfrist = aktivitet.stillingFraNavData?.svarfrist;
    const datobegrensninger = {
        after: endOfToday(),
    };

    const handlers = useForm<KanDeles>({
        resolver: zodResolver(getSchema(datobegrensninger, erVeileder)),
        defaultValues: { kanDeles: undefined },
    });
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = handlers;

    const { field: kanDeles } = useController({
        name: 'kanDeles',
        control,
    });

    useEffect(() => {
        if (kanDeles.value === SvarType.JA) {
            setInfoTekst('Stillingen flyttes til "Gjennomfører"');
        }
        if (kanDeles.value === SvarType.NEI) {
            setInfoTekst('Stillingen flyttes til "Avbrutt"');
        }
    }, [kanDeles.value]);

    const onSubmit = (data: KanDeles) => {
        dispatch(
            oppdaterCVSvar({
                aktivitetId: aktivitet.id,
                aktivitetVersjon: aktivitet.versjon,
                kanDeles: data.kanDeles === SvarType.JA,
                avtaltDato: data.avtaltDato,
            }),
        );
        return Promise.resolve();
    };

    const oppdaterCvFeil = useSelector(selectDeleCVFeil);

    return (
        <form
            className={'bg-surface-subtle rounded-md border-border-default border p-4 space-y-8'}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <FormProvider {...handlers}>
                <div className="flex flex-col">
                    <Heading size="medium" level="2">
                        {overskrift}
                    </Heading>
                    <Ingress className="mt-1" />
                    <BodyShort className="mt-1">Svar før: {formaterDatoManed(svarfrist)}</BodyShort>
                </div>
                {erVeileder ? <SvarPaaVegneAvBruker datoBegrensninger={datobegrensninger} /> : null}
                <RadioGroup
                    legend={overskrift}
                    hideLegend
                    value={kanDeles.value ?? null}
                    name={kanDeles.name}
                    onChange={kanDeles.onChange}
                    ref={kanDeles.ref}
                    role="radiogroup"
                    error={errors.kanDeles?.message}
                >
                    <Radio id="kanDeles" value={SvarType.JA.toString()}>
                        {JaSvarTekst}
                    </Radio>
                    <Radio value={SvarType.NEI.toString()}>{NeiSvarTekst}</Radio>
                </RadioGroup>

                <CustomErrorSummary errors={errors} />
                <Feilmelding feilmeldinger={oppdaterCvFeil} />
                <div className="flex gap-4 items-center mt-8">
                    <Button disabled={isSubmitting}>Lagre</Button>
                    {infoTekst && (
                        <Alert variant="info" inline>
                            {infoTekst}
                        </Alert>
                    )}
                </div>
            </FormProvider>
        </form>
    );
};
