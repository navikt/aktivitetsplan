import moment from 'moment';
import { toDatePrettyPrint, erGyldigISODato } from '../../../utils';

export function dateLess(date1, date2) {
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();

    const mon1 = date1.getMonth();
    const mon2 = date2.getMonth();

    const day1 = date1.getDate();
    const day2 = date2.getDate();

    if (year1 < year2) return true;
    else if (year1 === year2 && mon1 < mon2) return true;

    return year1 === year2 && mon1 === mon2 && day1 < day2;
}

export function dateGreater(date1, date2) {
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();

    const mon1 = date1.getMonth();
    const mon2 = date2.getMonth();

    const day1 = date1.getDate();
    const day2 = date2.getDate();

    if (year1 > year2) return true;
    else if (year1 === year2 && mon1 > mon2) return true;

    return year1 === year2 && mon1 === mon2 && day1 > day2;
}

export function validerDatoField(input, intl, alternativer) {
    const { fra, til } = alternativer;
    const inputDato = moment(input);

    const fraDato = moment(fra);
    const tilDato = moment(til);

    if (input && !erGyldigISODato(input)) {
        return intl.formatMessage({
            id: 'datepicker.feilmelding.ugyldig-dato',
        });
    } else if (
        fra &&
        til &&
        (inputDato.isAfter(tilDato, 'day') || fraDato.isAfter(inputDato, 'day'))
    ) {
        tilDato.add(1, 'day');
        fraDato.subtract(1, 'day');

        const msgValues = {
            fradato: toDatePrettyPrint(fraDato.toDate()),
            tildato: toDatePrettyPrint(tilDato.toDate()),
        };
        return intl.formatMessage({
            id: 'datepicker.feilmelding.innenfor-periode',
            values: msgValues,
        });
    }
    return undefined;
}
