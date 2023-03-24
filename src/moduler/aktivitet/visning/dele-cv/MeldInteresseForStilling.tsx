import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, BodyShort, Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { endOfDay, endOfToday, parseISO, subDays } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { z } from 'zod';

import { StillingFraNavAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { formaterDatoManed } from '../../../../utils/dateUtils';
import { selectErVeileder } from '../../../identitet/identitet-selector';
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
type ValidatorProps = {
    erVeileder: boolean;
    opprettetDato: string;
};

const kanDelesField = z.nativeEnum(SvarType, {
    required_error: 'Du må svare ja eller nei',
    invalid_type_error: 'Ikke en gyldig dato',
});
const getSchema = (
    { before: disabledBefore, after: disabledAfter }: { before: Date; after: Date },
    erVeileder: boolean
) => {
    if (erVeileder) {
        return z.object({
            kanDeles: kanDelesField,
            avtaltDato: z
                .date({
                    required_error: 'Du må fylle ut datoen for når du var i dialog med brukeren',
                    invalid_type_error: 'Ugyldig dato',
                })
                .min(disabledBefore, {
                    message: 'Dato for dialog kan ikke være mer enn syv dager før kortet ble opprettet',
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
    const dispatch = useDispatch();

    const erVeileder = useSelector(selectErVeileder);
    const opprettetDato = aktivitet.opprettetDato;

    const syvDagerFoerOpprettet = subDays(parseISO(opprettetDato), 7);
    const svarfrist = aktivitet.stillingFraNavData?.svarfrist;
    const datobegrensninger = {
        before: syvDagerFoerOpprettet,
        after: endOfToday(),
    };

    const handlers = useForm<KanDeles>({
        resolver: zodResolver(getSchema(datobegrensninger, erVeileder)),
        defaultValues: { kanDeles: undefined },
        mode: 'all',
    });
    const {
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = handlers;

    console.log('avtaltDato', watch('avtaltDato'));

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
            oppdaterCVSvar(
                aktivitet.id,
                aktivitet.versjon,
                data.kanDeles === SvarType.JA,
                data.avtaltDato
            ) as unknown as AnyAction
        );
        return Promise.resolve();
    };

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
