import { Alert, BodyShort, Link, TextField, UNSAFE_useDatepicker } from '@navikt/ds-react';
import DatePicker from '@navikt/ds-react/esm/date/datepicker/DatePicker';
import useFormstate from '@nutgaard/use-formstate';
import React from 'react';

import { INTERNET_KANAL, MOTE_TYPE, OPPMOTE_KANAL, STATUS_PLANLAGT } from '../../../../constant';
import { MoteAktivitet } from '../../../../datatypes/internAktivitetTypes';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Input from '../../../../felles-komponenter/skjema/input/Input';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import EksternLenkeIkon from '../../../../felles-komponenter/utils/EksternLenkeIkon';
import { beregnFraTil, beregnKlokkeslettVarighet } from '../../aktivitet-util';
import AktivitetFormHeader from '../aktivitet-form-header';
import LagreAktivitet from '../LagreAktivitet';
import VelgKanal from '../VelgKanal';
import {
    FORBEREDELSER_MAKS_LENGDE,
    HENSIKT_MAKS_LENGDE,
    validateAdresse,
    validateForberedelser,
    validateHensikt,
    validateKanal,
    validateKlokkeslett,
    validateMoteDato,
    validateTittel,
    validateVarighet,
} from './validate';

interface Props {
    onSubmit: (data: { status: string; avtalt: boolean } & FormType) => Promise<any>;
    isDirtyRef?: { current: boolean };
    aktivitet?: MoteAktivitet;
}

type FormType = {
    tittel: string;
    dato: string;
    klokkeslett: string;
    varighet: string;
    kanal: string;
    adresse: string;
    beskrivelse: string;
    forberedelser: string;
};

const HuskVarsleBruker = ({ avtalt, pristine }: { avtalt: boolean; pristine: boolean }) => {
    if (!avtalt || pristine) {
        return null;
    }
    return (
        <Alert variant="warning" className="mb-8">
            Husk å sende en dialogmelding til brukeren om endringen du gjør.
        </Alert>
    );
};

const VideoInfo = ({ kanal }: { kanal: string }) => {
    if (kanal === INTERNET_KANAL) {
        return (
            <BodyShort className="mote-aktivitet-form__video-info">
                Les om{' '}
                <Link
                    href="https://navno.sharepoint.com/sites/intranett-it/SitePages/Videom%C3%B8te-med-brukere.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    rutiner for videomøte her <EksternLenkeIkon />
                </Link>
            </BodyShort>
        );
    }
    return null;
};

export const defaultBeskrivelse = 'Vi ønsker å snakke med deg om aktiviteter du har gjennomført og videre oppfølging.';

const MoteAktivitetForm = (props: Props) => {
    const { aktivitet, isDirtyRef, onSubmit } = props;

    const validator = useFormstate<FormType, Partial<MoteAktivitet>>({
        tittel: (val, _, a) => validateTittel(a?.avtalt || false, val),
        klokkeslett: (val, _, a) => validateKlokkeslett(a?.avtalt || false, val),
        varighet: (val, _, a) => validateVarighet(a?.avtalt || false, val),
        kanal: (val, _, a) => validateKanal(a?.avtalt || false, val),
        adresse: (val, _, a) => validateAdresse(a?.avtalt || false, val),
        beskrivelse: (val, _, a) => validateHensikt(a?.avtalt || false, val),
        forberedelser: (val, _, a) => validateForberedelser(a?.avtalt || false, val),
        dato: (val) => validateMoteDato(val),
    });

    const avtalt = aktivitet?.avtalt || false;
    const dato = aktivitet ? beregnKlokkeslettVarighet(aktivitet) : undefined;
    const beskrivelse = aktivitet?.beskrivelse || '';

    const initalValue = {
        tittel: aktivitet?.tittel || '',
        klokkeslett: dato?.klokkeslett ? dato.klokkeslett : '10:00',
        varighet: dato?.varighet ? dato.varighet : '00:45',
        kanal: aktivitet?.kanal || OPPMOTE_KANAL,
        adresse: aktivitet?.adresse || '',
        beskrivelse: beskrivelse ? beskrivelse : defaultBeskrivelse,
        forberedelser: aktivitet?.forberedelser || '',
        dato: aktivitet?.fraDato || '',
    };

    const state = validator(initalValue);

    const { datepickerProps, inputProps, selectedDay } = UNSAFE_useDatepicker({
        onDateChange: (dato) => {
            state.setValue('dato', dato?.toString() || '');
        },
    });

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    return (
        <form
            onSubmit={state.onSubmit((formValues) =>
                onSubmit({
                    ...formValues,
                    ...beregnFraTil(formValues),
                    status: STATUS_PLANLAGT,
                    avtalt: false,
                    dato: selectedDay!!.toString(),
                })
            )}
            autoComplete="off"
            noValidate
        >
            <div className="skjema-innlogget aktivitetskjema space-y-4">
                <AktivitetFormHeader tittel="Møte med NAV" aktivitetsType={MOTE_TYPE} />
                <HuskVarsleBruker avtalt={avtalt} pristine={state.pristine} />
                <Input disabled={avtalt} label="Tema for møtet *" {...state.fields.tittel} />

                <div className="mote-aktivitet-form__velg-mote-klokkeslett">
                    <DatePicker {...datepickerProps} disabled={[{ before: new Date() }]}>
                        <DatePicker.Input
                            {...state.fields.dato.input}
                            {...inputProps}
                            required
                            label={'Dato *'}
                            error={state.fields.dato.touched ? state.fields.dato.error : undefined}
                        />
                    </DatePicker>
                    <TextField
                        label="Klokkeslett *"
                        {...state.fields.klokkeslett.input}
                        type={'time' as any}
                        step="300"
                    />
                    <TextField label="Varighet *" {...state.fields.varighet.input} type={'time' as any} step="900" />
                </div>
                <VelgKanal label="Møteform *" {...state.fields.kanal} />
                <VideoInfo kanal={state.fields.kanal.input.value} />

                <Input label="Møtested eller annen praktisk informasjon *" {...state.fields.adresse} />
                <Textarea
                    disabled={avtalt}
                    label="Hensikt med møtet *"
                    maxLength={HENSIKT_MAKS_LENGDE}
                    required
                    {...state.fields.beskrivelse}
                />
                <Textarea
                    disabled={avtalt}
                    label="Forberedelser til møtet"
                    maxLength={FORBEREDELSER_MAKS_LENGDE}
                    {...state.fields.forberedelser}
                />
                <FormErrorSummary submittoken={state.submittoken} errors={{ ...state.errors }} />
            </div>
            <LagreAktivitet />
        </form>
    );
};

export default MoteAktivitetForm;
