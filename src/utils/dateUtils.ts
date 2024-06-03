import {
    addDays,
    differenceInDays,
    differenceInMilliseconds,
    endOfToday,
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

function formatter(dato: string | null | Date | undefined, format: string) {
    if (dato) {
        const datoVerdi = typeof dato === 'string' ? parseISO(dato) : dato;
        return isValid(datoVerdi) ? formatDate(datoVerdi, format, { locale: nb }) : undefined;
    }
    return undefined;
}

export function formaterDatoManed(dato: string | Date | undefined) {
    return formatter(dato, 'PPP');
}

export function formaterDatoKortManed(dato: string | Date | undefined | null) {
    return formatter(dato, 'PP');
}

export function formaterDatoKortManedTid(dato: string | Date) {
    return formatter(dato, "PP 'kl' HH.mm");
}

export function formaterTid(dato: string | Date) {
    return formatter(dato, 'HH.mm');
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

export function erMerEnnSyvDagerTil(dato: string): boolean {
    const datoVerdi = parseISO(dato);
    return isValid(datoVerdi) ? isAfter(datoVerdi, startOfDay(addDays(new Date(), 7))) : false;
}

export function formaterDatoEllerTidSiden(dato: string | undefined) {
    if (!dato) return undefined;

    const datoVerdi = parseISO(dato);

    if (isValid(datoVerdi)) {
        if (!erMerEnntoDagerSiden(dato)) {
            return formaterDatoTidSiden(dato);
        }
        return formaterDatoKortManedTid(dato);
    }
    return undefined;
}

export const msSince = (date: string) => differenceInMilliseconds(new Date(), parseISO(date));

const oneIfPresent = (x: string | undefined) => (x ? 1 : 0);

export function datoComparator(a: string, b: string) {
    if (a == null || b == null) {
        return oneIfPresent(a) - oneIfPresent(b);
    }
    return parseISO(a).getTime() - parseISO(b).getTime();
}

export function dagerTil(dato: string) {
    return differenceInDays(startOfDay(parseISO(dato)), startOfDay(new Date()));
}

export const isValidDate = (day?: Date): boolean => {
    return !!(day && !Number.isNaN(day.getTime()) && day.getFullYear() > 999);
};
