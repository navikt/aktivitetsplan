//TODO: konvertere dato stuff til date-fns og flytte til dateUtils.ts

import {
    addDays,
    differenceInDays,
    differenceInMilliseconds,
    endOfToday,
    formatDistance,
    isAfter,
    isBefore,
    isValid,
    parseISO,
    startOfDay,
    subDays,
} from 'date-fns';
import { format as formatDate } from 'date-fns-tz';
import nb from 'date-fns/locale/nb';
import { ReactNode } from 'react';

export function fn(value: any) {
    return typeof value === 'function' ? value : () => value;
}

export const msSince = (date: string) => differenceInMilliseconds(new Date(), parseISO(date));

export function autobind(ctx: any) {
    Object.getOwnPropertyNames(ctx.constructor.prototype)
        .filter((prop) => typeof ctx[prop] === 'function')
        .forEach((method) => {
            // eslint-disable-next-line
            ctx[method] = ctx[method].bind(ctx);
        });
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString()
        .substring(1);
}

export function guid() {
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export function erInternlenke(href: string) {
    return !!href && !href.startsWith('http://') && !href.startsWith('https://');
}

export function storeForbokstaver(...tekster: string[]) {
    const tekst = tekster.filter((s) => s).join(' ');

    return tekst
        .split(' ')
        .map((ord) => ord.charAt(0).toUpperCase() + ord.slice(1).toLowerCase())
        .join(' ');
}

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
            return formaterDatoTidSiden(dato);
        }
        return formaterDatoKortManedTid(dato);
    }
    return undefined;
}

export function datoComparator(a: string, b: string) {
    const dateA = parseISO(a);
    const dateB = parseISO(b);
    return isValid(dateA) && isValid(dateB) ? dateA.getTime() - dateB.getTime() : oneIfPresent(a) - oneIfPresent(b);
}

const oneIfPresent = (x: string | undefined) => (x ? 1 : 0);

export function HiddenIf({ hidden, children }: { hidden: boolean; children: ReactNode }) {
    if (hidden) {
        return null;
    }
    return children;
}

export function dagerTil(dato: string) {
    return differenceInDays(startOfDay(parseISO(dato)), startOfDay(new Date()));
}

function erGCP() {
    return window.location.hostname.endsWith('intern.nav.no');
}

export function getContextPath() {
    return erGCP() ? '' : import.meta.env.BASE_URL;
}
