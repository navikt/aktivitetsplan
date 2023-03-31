import {
    addDays,
    differenceInDays,
    differenceInMilliseconds,
    endOfToday,
    format,
    format as formatDate,
    formatDistance,
    isAfter,
    isBefore,
    isValid,
    parseISO,
    startOfDay,
    subDays,
} from 'date-fns';
import nb from 'date-fns/locale/nb';

export const todayIsoString = () => endOfToday().toISOString();

export const erGyldigISODato = (isoDato: string) => {
    return !!(isoDato && isValid(parseISO(isoDato)));
};

function formatter(dato: string | Date, format: string) {
    if (dato) {
        const datoVerdi = typeof dato === 'string' ? parseISO(dato) : dato;
        return isValid(datoVerdi) ? formatDate(datoVerdi, format, { locale: nb }) : undefined;
    }
    return undefined;
}

export function formaterDatoTid(dato: string) {
    return formatter(dato, 'd.LL.y HH:mm');
}

export function formaterDatoManed(dato: string) {
    return formatter(dato, 'd. MMMM Y');
}

export function formaterDatoKortManed(dato: string) {
    return formatter(dato, 'PP');
}

export function formaterDatoKortManedTid(dato: string) {
    return formatter(dato, "d. MMM Y 'kl' HH:mm");
}

export function formaterTid(dato: string) {
    return formatter(dato, 'HH:mm');
}

export function formaterDatoTidSiden(dato: string) {
    const datoVerdi = parseISO(dato);
    return isValid(datoVerdi) ? formatDistance(datoVerdi, new Date(), { addSuffix: true, locale: nb }) : undefined;
}

function erMerEnntoDagerSiden(dato: string) {
    const datoVerdi = parseISO(dato);
    const toDagerSiden = subDays(endOfToday(), 2);
    return isValid(datoVerdi) ? isBefore(datoVerdi, toDagerSiden) : false;
}

export function erMerEnnSyvDagerTil(dato: string) {
    const datoVerdi = parseISO(dato);
    return isValid(datoVerdi) ? isAfter(datoVerdi, startOfDay(addDays(new Date(), 7))) : false;
}

export function formaterDatoEllerTidSiden(dato: string) {
    const datoVerdi = parseISO(dato);

    if (isValid(datoVerdi)) {
        if (erMerEnntoDagerSiden(dato)) {
            return format(datoVerdi, 'dd.M.y');
        }
        return formaterDatoKortManedTid(dato);
    }
    return undefined;
}

export const msSince = (date: string) => differenceInMilliseconds(new Date(), parseISO(date));

const oneIfPresent = (x: string | undefined) => (x ? 1 : 0);
export function datoComparator(a: string, b: string) {
    const dateA = parseISO(a);
    const dateB = parseISO(b);
    return isValid(dateA) && isValid(dateB) ? dateA.getTime() - dateB.getTime() : oneIfPresent(a) - oneIfPresent(b);
}

export function dagerTil(dato: string) {
    return differenceInDays(startOfDay(parseISO(dato)), startOfDay(new Date()));
}
