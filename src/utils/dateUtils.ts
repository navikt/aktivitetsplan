import { tz, TZDate } from '@date-fns/tz';
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
import { nb } from 'date-fns/locale/nb';

export const NORSK_TIDSSONE = 'Europe/Oslo';

export const NORSK_TID_SUFFIX = ' (norsk tid)';

export function norskTidSuffix(dato: string | Date | null | undefined): string {
    if (!dato) return '';
    const datoVerdi = typeof dato === 'string' ? parseISO(dato) : dato;
    if (!isValid(datoVerdi)) return '';
    const osloOffset = new TZDate(datoVerdi.getTime(), NORSK_TIDSSONE).getTimezoneOffset();
    const lokalOffset = new Date(datoVerdi.getTime()).getTimezoneOffset();
    return osloOffset === lokalOffset ? '' : NORSK_TID_SUFFIX;
}

export const erGyldigISODato = (isoDato: string | undefined | null) => {
    return !!(isoDato && isValid(parseISO(isoDato)));
};

export const toLocalISODateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function formatter(dato: string | null | Date | undefined, format: string) {
    if (dato) {
        const datoVerdi = typeof dato === 'string' ? parseISO(dato) : dato;
        return isValid(datoVerdi)
            ? formatDate(datoVerdi, format, { locale: nb, in: tz(NORSK_TIDSSONE) })
            : undefined;
    }
    return undefined;
}

export function formaterDatoManed(dato: string | Date | undefined) {
    return formatter(dato, 'PPP');
}

export function formaterDatoKortManed(dato: string | Date | undefined | null) {
    return formatter(dato, 'PP');
}

export function formaterDatoKortManedTid(dato: string | Date | undefined | null) {
    const formatert = formatter(dato, "PP 'kl' HH.mm");
    return formatert ? `${formatert}${norskTidSuffix(dato)}` : undefined;
}

export function formaterTid(dato: string | undefined | null | Date) {
    const formatert = formatter(dato, 'HH.mm');
    return formatert ? `${formatert}${norskTidSuffix(dato)}` : undefined;
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

const oneIfPresent = (x: string | undefined | null) => (x ? 1 : 0);

export function datoComparator(a: string | null | undefined, b: string | null | undefined) {
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
