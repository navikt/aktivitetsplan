import { Alert, Link, TextField } from '@navikt/ds-react';
import useFormstate from '@nutgaard/use-formstate';
import moment, { now } from 'moment';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { INTERNET_KANAL, MOTE_TYPE, OPPMOTE_KANAL, STATUS_PLANLAGT } from '../../../../constant';
import { MoteAktivitet } from '../../../../datatypes/internAktivitetTypes';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/PartialDateRangePicker';
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
    onSubmit: (data: { status: string; avtalt: boolean }) => Promise<any>;
    isDirtyRef?: { current: boolean };
    aktivitet: MoteAktivitet;
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
            <Normaltekst className="mote-aktivitet-form__video-info">
                Les om{' '}
                <Link
                    href="https://navno.sharepoint.com/sites/intranett-it/SitePages/Videom%C3%B8te-med-brukere.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    rutiner for videomøte her <EksternLenkeIkon />
                </Link>
            </Normaltekst>
        );
    }
    return null;
};

export const defaultBeskrivelse = 'Vi ønsker å snakke med deg om aktiviteter du har gjennomført og videre oppfølging.';

const MoteAktivitetForm = (props: Props) => {
    const { aktivitet, isDirtyRef, onSubmit } = props;

    const validator = useFormstate<FormType, MoteAktivitet>({
        tittel: (val, _, a) => validateTittel(a.avtalt, val),
        dato: validateMoteDato,
        klokkeslett: (val, _, a) => validateKlokkeslett(a.avtalt, val),
        varighet: (val, _, a) => validateVarighet(a.avtalt, val),
        kanal: (val, _, a) => validateKanal(a.avtalt, val),
        adresse: (val, _, a) => validateAdresse(a.avtalt, val),
        beskrivelse: (val, _, a) => validateHensikt(a.avtalt, val),
        forberedelser: (val, _, a) => validateForberedelser(a.avtalt, val),
    });

    const maybeAktivitet = aktivitet || {};
    const avtalt = maybeAktivitet.avtalt === true;
    const dato = beregnKlokkeslettVarighet(maybeAktivitet);
    const beskrivelse = maybeAktivitet.beskrivelse || '';

    const initalValue = {
        tittel: maybeAktivitet.tittel || '',
        dato: maybeAktivitet.fraDato || '',
        klokkeslett: dato.klokkeslett ? dato.klokkeslett : '10:00',
        varighet: dato.varighet ? dato.varighet : '00:45',
        kanal: maybeAktivitet.kanal || OPPMOTE_KANAL,
        adresse: maybeAktivitet.adresse || '',
        beskrivelse: beskrivelse ? beskrivelse : defaultBeskrivelse,
        forberedelser: maybeAktivitet.forberedelser || '',
    };

    const state = validator(initalValue, aktivitet);

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    return (
        <form
            onSubmit={state.onSubmit((x) =>
                onSubmit({
                    ...x,
                    ...beregnFraTil(x),
                    status: STATUS_PLANLAGT,
                    avtalt: false,
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
                    {/*<DatoField*/}
                    {/*    limitations={{ minDate: moment(now()).toISOString() }}*/}
                    {/*    label="Dato *"*/}
                    {/*    {...state.fields.dato}*/}
                    {/*    required*/}
                    {/*/>*/}
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
                    visTellerFra={500}
                    required
                    {...state.fields.beskrivelse}
                />
                <Textarea
                    disabled={avtalt}
                    label="Forberedelser til møtet"
                    maxLength={FORBEREDELSER_MAKS_LENGDE}
                    visTellerFra={200}
                    {...state.fields.forberedelser}
                />
                <FormErrorSummary submittoken={state.submittoken} errors={state.errors} />
            </div>
            <LagreAktivitet />
        </form>
    );
};

export default MoteAktivitetForm;
