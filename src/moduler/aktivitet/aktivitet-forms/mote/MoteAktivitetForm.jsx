import useFormstate from '@nutgaard/use-formstate';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import PT from 'prop-types';
import React from 'react';

import { INTERNET_KANAL, MOTE_TYPE, OPPMOTE_KANAL } from '../../../../constant';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/Datovelger';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Input from '../../../../felles-komponenter/skjema/input/Input';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import EksternLenkeIkon from '../../../../felles-komponenter/utils/ekstern-lenke-ikon';
import * as AppPT from '../../../../proptypes';
import { beregnFraTil, beregnKlokkeslettVarighet } from '../../aktivitet-util';
import AktivitetFormHeader from '../aktivitet-form-header';
import LagreAktivitet from '../LagreAktivitet';
import VelgKanal from '../VelgKanal';
import {
    FORBEREDELSER_MAKS_LENGDE,
    HENSIKT_MAKS_LENGDE,
    validateAdresse,
    validateForberedelser,
    validateFraDato,
    validateHensikt,
    validateKanal,
    validateKlokkeslett,
    validateTittel,
    validateVarighet,
} from './validate';

function erAvtalt(aktivitet) {
    return aktivitet.avtalt === true;
}

const HuskVarsleBruker = (props) => {
    if (!props.avtalt || props.pristine) {
        return null;
    }
    return (
        <AlertStripeAdvarsel className="mote-aktivitet_husk_bruker">
            Husk å sende en dialogmelding til brukeren om endringen du gjør.
        </AlertStripeAdvarsel>
    );
};

function VideoInfo(props) {
    if (props.kanal === INTERNET_KANAL) {
        return (
            <Normaltekst className="mote-aktivitet-form__video-info">
                Les om{' '}
                <Lenke
                    href="https://navno.sharepoint.com/sites/intranett-it/SitePages/Videom%C3%B8te-med-brukere.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    rutiner for videomøte her <EksternLenkeIkon />
                </Lenke>
            </Normaltekst>
        );
    }
    return null;
}

export const defaultBeskrivelse = 'Vi ønsker å snakke med deg om aktiviteter du har gjennomført og videre oppfølging.';

function MoteAktivitetForm(props) {
    const { aktivitet, isDirtyRef, onSubmit, endre } = props;

    const validator = useFormstate({
        tittel: (val, values, aktivitet) => validateTittel(erAvtalt(aktivitet), val),
        dato: (val, values, aktivitet) => validateFraDato(erAvtalt(aktivitet), aktivitet.fraDato, val),
        klokkeslett: (val, values, aktivitet) => validateKlokkeslett(erAvtalt(aktivitet), val),
        varighet: (val, values, aktivitet) => validateVarighet(erAvtalt(aktivitet), val),
        kanal: (val, values, aktivitet) => validateKanal(erAvtalt(aktivitet), val),
        adresse: (val, values, aktivitet) => validateAdresse(erAvtalt(aktivitet), val),
        beskrivelse: (val, values, aktivitet) => validateHensikt(erAvtalt(aktivitet), val),
        forberedelser: (val, values, aktivitet) => validateForberedelser(erAvtalt(aktivitet), val),
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
        beskrivelse: endre ? beskrivelse : defaultBeskrivelse,
        forberedelser: maybeAktivitet.forberedelser || '',
    };

    const state = validator(initalValue, aktivitet);

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    return (
        <form onSubmit={state.onSubmit((x) => onSubmit({ ...x, ...beregnFraTil(x) }))} autoComplete="off" noValidate>
            <SkjemaGruppe className="skjema-innlogget aktivitetskjema">
                <AktivitetFormHeader tittel="Møte med NAV" aktivitetsType={MOTE_TYPE} />
                <HuskVarsleBruker avtalt={avtalt} pristine={state.pristine} />
                <Input disabled={avtalt} label="Tema for møtet *" {...state.fields.tittel} />

                <div className="mote-aktivitet-form__velg-mote-klokkeslett">
                    <DatoField label="Dato *" {...state.fields.dato} required />
                    <Input bredde="S" label="Klokkeslett *" {...state.fields.klokkeslett} type="time" step="300" />
                    <Input bredde="S" label="Varighet *" {...state.fields.varighet} type="time" step="900" />
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
            </SkjemaGruppe>
            <LagreAktivitet />
        </form>
    );
}

MoteAktivitetForm.propTypes = {
    onSubmit: PT.func.isRequired,
    isDirtyRef: PT.shape({ current: PT.bool }),
    aktivitet: AppPT.aktivitet,
    endre: PT.bool,
};

MoteAktivitetForm.defaultProps = {
    aktivitet: undefined,
    isDirtyRef: false,
    endre: false,
};

export default MoteAktivitetForm;
