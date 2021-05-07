import moment from 'moment';

import { erGyldigISODato, toDatePrettyPrint } from '../../../utils';

export const validerDato = (value: string | null, tidligsteFom?: string, senesteTom?: string) => {
    if (!value || value.trim().length === 0) {
        return undefined;
    }

    if (!erGyldigISODato(value)) {
        return 'Datoen må ha format dd.mm.åååå';
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

    return undefined;
};
