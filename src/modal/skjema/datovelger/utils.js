import moment from 'moment';
import { toDatePrettyPrint, erGyldigISODato } from '../../../utils';

export function dateLessOrEqual(date1, date2) {
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();

    const mon1 = date1.getMonth();
    const mon2 = date2.getMonth();

    const day1 = date1.getDate();
    const day2 = date2.getDate();

    if (year1 < year2) return true;
    else if (year1 === year2 && mon1 < mon2) return true;

    return year1 === year2 && mon1 === mon2 && day1 <= day2;
}

export function dateGreaterOrEqual(date1, date2) {
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();

    const mon1 = date1.getMonth();
    const mon2 = date2.getMonth();

    const day1 = date1.getDate();
    const day2 = date2.getDate();

    if (year1 > year2) return true;
    else if (year1 === year2 && mon1 > mon2) return true;

    return year1 === year2 && mon1 === mon2 && day1 >= day2;
}

export function validerPeriode(input, alternativer) {
    const { fra, til } = alternativer;
    const inputDato = moment(input);

    const fraDato = moment(fra);
    const tilDato = moment(til);

    if (fra && til && (inputDato.isAfter(tilDato, 'day') || fraDato.isAfter(inputDato, 'day'))) {
        tilDato.add(1, 'day');
        fraDato.subtract(1, 'day');
        return `Datoen må være innenfor perioden ${toDatePrettyPrint(fraDato.toDate())}-${toDatePrettyPrint(tilDato.toDate())}`;
    }
    if (til && inputDato.isAfter(tilDato, 'day')) {
        tilDato.add(1, 'day');
        return `Datoen må være før ${toDatePrettyPrint(tilDato.toDate())}`;
    }
    if (fra && fraDato.isAfter(inputDato, 'day')) {
        fraDato.subtract(1, 'day');
        return `Datoen må være etter ${toDatePrettyPrint(fraDato.toDate())}`;
    }
    return undefined;
}

export function validerDatoField(input, alternativer) {
    if (!input) {
        return undefined;
    } else if (!erGyldigISODato(input)) {
        return 'Ugyldig dato';
    } else if (alternativer && (alternativer.fra || alternativer.til)) {
        return validerPeriode(input, alternativer);
    }
    return undefined;
}
