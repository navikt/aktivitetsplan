import React from 'react';
import PT from 'prop-types';
import useFormstate from '@nutgaard/use-formstate';
import Textarea from '../../../../felles-komponenter/skjema/input/textarea';
import Input from '../../../../felles-komponenter/skjema/input/input';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/datovelger';
import { MOTE_TYPE, OPPMOTE_KANAL } from '../../../../constant';
import {
    beregnFraTil,
    beregnKlokkeslettVarighet,
    formatterKlokkeslett,
    formatterVarighet,
} from '../../aktivitet-util';
import LagreAktivitet from '../lagre-aktivitet';
import AktivitetFormHeader from '../aktivitet-form-header';
import {
    validateAdresse,
    validateForberedelser,
    validateFraDato,
    validateHensikt,
    validateTittel,
    HENSIKT_MAKS_LENGDE,
    FORBEREDELSER_MAKS_LENGDE,
    validateKlokkeslett,
    validateVarighet,
    validateKanal,
} from './validate';

import * as AppPT from '../../../../proptypes';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Select from '../../../../felles-komponenter/skjema/input/select';
import VelgKanal from '../velg-kanal';

const tidspunkter = Array.from(new Array(53)).map((noValue, index) => {
    const minutter = index * 15 + 7 * 60;
    return (
        <option key={minutter} value={minutter}>
            {formatterKlokkeslett(minutter)}
        </option>
    );
});

const varigheter = Array.from(new Array(24)).map((noValue, index) => {
    const minutter = (index + 1) * 15;
    return (
        <option key={minutter} value={minutter}>
            {formatterVarighet(minutter)}
        </option>
    );
});

const defaultBeskrivelse =
    'Vi ønsker å snakke med deg om aktiviteter du har gjennomført og videre oppfølging.';

function MoteAktivitetForm(props) {
    const { aktivitet, isDirtyRef, onSubmit, endre } = props;
    const maybeAktivitet = aktivitet || {};
    const erAvtalt = maybeAktivitet.avtalt === true;
    const dato = beregnKlokkeslettVarighet(maybeAktivitet);
    const beskrivelse = maybeAktivitet.beskrivelse || '';

    const validator = useFormstate({
        tittel: val => validateTittel(erAvtalt, val),
        dato: val => validateFraDato(erAvtalt, maybeAktivitet.fraDato, val),
        klokkeslett: val => validateKlokkeslett(erAvtalt, val),
        varighet: val => validateVarighet(erAvtalt, val),
        kanal: val => validateKanal(erAvtalt, val),
        adresse: val => validateAdresse(erAvtalt, val),
        beskrivelse: val => validateHensikt(erAvtalt, val),
        forberedelser: val => validateForberedelser(erAvtalt, val),
    });

    const state = validator({
        tittel: maybeAktivitet.tittel || '',
        dato: maybeAktivitet.fraDato || '',
        klokkeslett: dato.klokkeslett ? dato.klokkeslett.toString() : '',
        varighet: dato.varighet ? dato.varighet.toString() : '',
        kanal: maybeAktivitet.kanal || OPPMOTE_KANAL,
        adresse: maybeAktivitet.adresse || '',
        beskrivelse: endre ? beskrivelse : defaultBeskrivelse,
        forberedelser: maybeAktivitet.forberedelser || '',
    });

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    return (
        <form
            onSubmit={state.onSubmit(x =>
                onSubmit({ ...x, ...beregnFraTil(x) })
            )}
            autoComplete="off"
        >
            <div className="skjema-innlogget aktivitetskjema">
                <FormErrorSummary
                    submittoken={state.submittoken}
                    errors={state.errors}
                />

                <AktivitetFormHeader
                    tittelId="mote-aktivitet-form.header"
                    pakrevdInfoId="aktivitet-form.pakrevd-felt-info"
                    ingressType={MOTE_TYPE}
                />

                <Input
                    disabled={erAvtalt}
                    label="Tema for møtet *"
                    {...state.fields.tittel}
                />

                <div className="mote-aktivitet-form__velg-mote-klokkeslett">
                    <DatoField label="Dato *" {...state.fields.dato} />
                    <Select
                        bredde="xs"
                        label="Klokkeslett *"
                        {...state.fields.klokkeslett}
                    >
                        {tidspunkter}
                    </Select>

                    <Select
                        bredde="xs"
                        label="Varighet *"
                        {...state.fields.varighet}
                    >
                        {varigheter}
                    </Select>
                </div>
                <VelgKanal
                    disabled={erAvtalt}
                    label="Møteform *"
                    {...state.fields.kanal}
                />

                <Input
                    label="Møtested eller annen praktisk informasjon *"
                    {...state.fields.adresse}
                />
                <Textarea
                    disabled={erAvtalt}
                    label="Hensikt med møtet"
                    maxLength={HENSIKT_MAKS_LENGDE}
                    {...state.fields.beskrivelse}
                />
                <Textarea
                    disabled={erAvtalt}
                    label="Forberedelser til møtet"
                    maxLength={FORBEREDELSER_MAKS_LENGDE}
                    {...state.fields.forberedelser}
                />
            </div>
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
