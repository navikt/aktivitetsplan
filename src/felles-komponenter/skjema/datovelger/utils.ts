import moment, { now } from 'moment';

import { erGyldigISODato, toDatePrettyPrint } from '../../../utils';

export const validerDato = (value: string | null, tidligsteFom?: string, senesteTom?: string) => {
    if (!value || value.trim().length === 0) {
        return;
    }

    if (!erGyldigISODato(value)) {
        return 'Datoen må være en gyldig dato på formatet dd.mm.åååå';
    }

    const inputDato = moment(value);

    const fraDato = moment(tidligsteFom);
    const tilDato = moment(senesteTom);

    if (tidligsteFom && senesteTom && (inputDato.isAfter(tilDato, 'day') || fraDato.isAfter(inputDato, 'day'))) {
        tilDato.add(1, 'day');
        fraDato.subtract(1, 'day');

        const prettyFra = toDatePrettyPrint(fraDato.toDate());
        const prettyTil = toDatePrettyPrint(tilDato.toDate());

        return `Datoen må være innenfor perioden ${prettyFra}-${prettyTil}`;
    }
};

export const validateTidligstDato = (value: string | null) => {
    if (!value || value.trim().length === 0) {
        return;
    }

    if (!erGyldigISODato(value)) {
        return 'Datoen må være en gyldig dato på formatet dd.mm.åååå';
    }

    const inputDato = moment(value);
    const tidligsteDato = moment(now());

    if (tidligsteDato.isAfter(inputDato, 'day')) {
        return `Datoen må tidligst være i dag`;
    }
};
