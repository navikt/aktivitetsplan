import React from 'react';
import PT from 'prop-types';
import useFormstate from '@nutgaard/use-formstate';
import Textarea from '../../../../felles-komponenter/skjema/input/textarea';
import Input from '../../../../felles-komponenter/skjema/input/input';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/datovelger';
import { INTERNET_KANAL, MOTE_TYPE, OPPMOTE_KANAL } from '../../../../constant';
import { beregnFraTil, beregnKlokkeslettVarighet } from '../../aktivitet-util';
import LagreAktivitet from '../lagre-aktivitet';
import AktivitetFormHeader from '../aktivitet-form-header';
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

import * as AppPT from '../../../../proptypes';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import VelgKanal from '../velg-kanal';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import { SkjemaGruppe } from 'nav-frontend-skjema';

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
                <a
                    href="https://navno.sharepoint.com/sites/intranett-it/SitePages/Videom%C3%B8te-med-brukere.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    rutiner for videomøte her
                </a>
            </Normaltekst>
        );
    }
    return null;
}

export const defaultBeskrivelse = 'Vi ønsker å snakke med deg om aktiviteter du har gjennomført og videre oppfølging.';

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

function MoteAktivitetForm(props) {
    const { aktivitet, isDirtyRef, onSubmit, endre } = props;
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
        <form onSubmit={state.onSubmit((x) => onSubmit({ ...x, ...beregnFraTil(x) }))} autoComplete="off">
            <SkjemaGruppe className="skjema-innlogget aktivitetskjema">
                <AktivitetFormHeader tittel="Møte med NAV" aktivitetsType={MOTE_TYPE} />
                <HuskVarsleBruker avtalt={avtalt} pristine={state.pristine} />
                <Input disabled={avtalt} label="Tema for møtet *" {...state.fields.tittel} />

                <div className="mote-aktivitet-form__velg-mote-klokkeslett">
                    <DatoField label="Dato *" {...state.fields.dato} />
                    <Input bredde="S" label="Klokkeslett *" {...state.fields.klokkeslett} type="time" step="300" />
                    <Input bredde="S" label="Varighet *" {...state.fields.varighet} type="time" step="900" />
                </div>
                <VelgKanal label="Møteform *" {...state.fields.kanal} />
                <VideoInfo kanal={state.fields.kanal.input.value} />

                <Input label="Møtested eller annen praktisk informasjon *" {...state.fields.adresse} />
                <Textarea
                    disabled={avtalt}
                    label="Hensikt med møtet"
                    maxLength={HENSIKT_MAKS_LENGDE}
                    {...state.fields.beskrivelse}
                />
                <Textarea
                    disabled={avtalt}
                    label="Forberedelser til møtet"
                    maxLength={FORBEREDELSER_MAKS_LENGDE}
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
