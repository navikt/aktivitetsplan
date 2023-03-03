import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { TextField, Textarea } from '@navikt/ds-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AppConfig } from '../../../../app';
import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../../constant';
import { SokeavtaleAktivitet } from '../../../../datatypes/internAktivitetTypes';
import Malverk from '../../../malverk/malverk';
import AktivitetFormHeader from '../aktivitet-form-header';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';

declare const window: {
    appconfig: AppConfig;
};

const schema = z.object({
    tittel: z.string(),
    fraDato: z.string(),
    tilDato: z.string(),
    antallStillingerIUken: z.number().lt(100, 'Antall søknader må ikke være høyere enn 99').nullable(),
    antallStillingerSokes: z.number().lt(100, 'Antall søknader må ikke være høyere enn 99').nullable(),
    avtaleOppfolging: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    beskrivelse: z.string().max(5000, 'Du må korte ned teksten til 5000 tegn').optional(),
});

type SokeavtaleAktivitetFormValues = z.infer<typeof schema>;

interface Props {
    aktivitet?: SokeavtaleAktivitet;
    onSubmit: (values: SokeavtaleAktivitetFormValues) => Promise<void>;
}

const SokeAvtaleAktivitetForm = (props: Props) => {
    const { aktivitet, onSubmit } = props;

    const defaultValues: SokeavtaleAktivitetFormValues = {
        tittel: aktivitet?.tittel || 'Avtale om å søke jobber',
        fraDato: aktivitet?.fraDato || '',
        tilDato: aktivitet?.tilDato || '',
        antallStillingerIUken: aktivitet?.antallStillingerIUken || null, // src/utils/object.js
        antallStillingerSokes: aktivitet?.antallStillingerSokes || null, // src/utils/object.js
        avtaleOppfolging: aktivitet?.avtaleOppfolging || '',
        beskrivelse: aktivitet?.beskrivelse || '',
    };
    const avtalt = aktivitet?.avtalt || false;

    const brukeStillingerIUken = !!aktivitet ? !!aktivitet.antallStillingerIUken : true;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<SokeavtaleAktivitetFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
        shouldFocusError: false,
    });

    const beskrivelseValue = watch('beskrivelse'); // for <Textarea /> character-count to work
    const avtaleOppfolging = watch('avtaleOppfolging'); // for <Textarea /> character-count to work

    const onMalChange = (newInitalValues: any) => {
        if (!newInitalValues) {
            reset();
        } else {
            Object.entries(newInitalValues).forEach(([name, value], _) => {
                setValue(name as any, value); // TODO pls typ malverk. pls fjern malverk
            });
        }
    };

    console.log(errors);

    return (
        <form autoComplete="off" noValidate onSubmit={handleSubmit((data) => onSubmit(data))}>
            <div className="skjema-innlogget aktivitetskjema space-y-4">
                <AktivitetFormHeader tittel="Avtale om å søke jobber" aktivitetsType={SOKEAVTALE_AKTIVITET_TYPE} />

                <Malverk
                    visible={window.appconfig.VIS_MALER}
                    endre={!!aktivitet}
                    onChange={onMalChange}
                    type="SOKEAVTALE"
                />

                {/* TODO datovelger her */}
                {/*<div className="dato-container">*/}
                {/*    {aktivitet?.avtalt === true && aktivitet?.fraDato ? (*/}
                {/*        <PartialDateRangePicker*/}
                {/*            error={rangeError}*/}
                {/*            onValidate={(val) => {*/}
                {/*                const error = getErrorMessageForDate(val);*/}
                {/*                if (error) setRangeError({ from: undefined, to: error });*/}
                {/*            }}*/}
                {/*            onChange={(toDate) => {*/}
                {/*                setDateRange({*/}
                {/*                    ...dateRange,*/}
                {/*                    to: toDate,*/}
                {/*                });*/}
                {/*            }}*/}
                {/*            from={parseDate(aktivitet.fraDato)!!}*/}
                {/*        />*/}
                {/*    ) : (*/}
                {/*        <DateRangePicker*/}
                {/*            error={rangeError}*/}
                {/*            onValidate={validateDateRange}*/}
                {/*            value={dateRange}*/}
                {/*            onChange={setDateRange}*/}
                {/*        />*/}
                {/*    )}*/}
                {/*</div>*/}

                {brukeStillingerIUken ? (
                    <TextField
                        disabled={avtalt}
                        type="number"
                        label="Antall søknader i uken (obligatorisk)"
                        id={'antallStillingerIUken'}
                        {...register('antallStillingerIUken', {
                            valueAsNumber: true,
                        })}
                        error={errors.antallStillingerIUken && errors.antallStillingerIUken.message}
                    />
                ) : (
                    <TextField
                        disabled={avtalt}
                        type="number"
                        label="Antall søknader i perioden (obligatorisk)"
                        id={'antallStillingerSokes'}
                        {...register('antallStillingerSokes', {
                            valueAsNumber: true,
                        })}
                        error={errors.antallStillingerSokes && errors.antallStillingerSokes.message}
                    />
                )}

                <Textarea
                    disabled={avtalt}
                    label="Oppfølging fra NAV"
                    maxLength={255}
                    {...register('avtaleOppfolging')}
                    error={errors.avtaleOppfolging && errors.avtaleOppfolging.message}
                    value={avtaleOppfolging}
                />
                <Textarea
                    disabled={avtalt}
                    label="Beskrivelse"
                    maxLength={5000}
                    {...register('beskrivelse')}
                    error={errors.beskrivelse && errors.beskrivelse.message}
                    value={beskrivelseValue}
                />
                {/*<CustomErrorSummary errors={errors} />*/}
                <LagreAktivitetKnapp />
            </div>
        </form>
    );
};

export default SokeAvtaleAktivitetForm;
