import { toDatePrettyPrint, erGyldigISODato, moment } from '../../../utils';

export function validerDato(value, tidligsteFom, senesteTom) {
    if (!value || value.trim().length === 0) {
        return null;
    }

    if (!erGyldigISODato(value)) {
        return 'Datoen du har oppgitt er ikke en gyldig dato';
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
    return null;
}
