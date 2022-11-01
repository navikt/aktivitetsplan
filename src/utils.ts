//TODO: konvertere dato stuff til date-fns og flytte til dateUtils.ts

import moment from 'moment';
import { ReactChildren } from 'react';

export function fn<T>(value: T): any {
    return typeof value === 'function' ? value : () => value;
}

export const msSince = (date: string | Date) => moment().unix() - moment(date).unix();

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
    return !!(isoDato && moment(isoDato, moment.ISO_8601).isValid());
};

const erLocalDate = (dato: { year: number; monthValue: number; dayOfMonth: number } | any): dato is moment.Moment => {
    return dato.year && dato.monthValue && dato.dayOfMonth;
};

export const toDate = (dato: moment.Moment | string): Date | null => {
    if (typeof dato === 'undefined' || dato === null) {
        return null;
    }
    return erLocalDate(dato) ? new Date(dato.year, dato.monthValue - 1, dato.dayOfMonth) : new Date(dato);
};

export const isBeforeNow = (dato: string) => {
    return moment(dato).toISOString() < moment().toISOString();
};

export const isSameOrAfter = (tildato: string, fradato: string) => {
    const momentTilDato = moment(tildato).startOf('day');
    const momentFraDato = moment(fradato).startOf('day');
    return momentTilDato.isSameOrAfter(momentFraDato);
};
export const isAfterNow = (date: string) => {
    return moment().isAfter(date);
};

export const minusMinutes = (date: string, minutes: number): string => {
    return moment(date).subtract(minutes, 'minutes').toISOString();
};

export const diffFromNowInSeconds = (date: string): number => {
    return moment(date).diff(moment(), 'seconds');
};
export const diffFromNowInMillis = (date: string): number => {
    return moment(date).diff(moment(), 'ms');
};
export const now = (): string => {
    return moment(moment()).toISOString();
};

export const formatMMSS = (seconds: number) => {
    return moment.duration(seconds).format('mm:ss', { trim: false });
};

export const isBeforeNowWithGranularity = (date: string, granulatity: null | 'day' = null): boolean => {
    return moment(date).isBefore(moment(now()), granulatity);
};

export const toDatePrettyPrint = (dato: string | moment.Moment | Date) => {
    if (typeof dato === 'undefined' || dato === null) {
        return null;
    }

    const tmpDato = toDate(dato)!!;

    const days = tmpDato.getDate() < 10 ? `0${tmpDato.getDate()}` : `${tmpDato.getDate()}`;
    const months = tmpDato.getMonth() + 1 < 10 ? `0${tmpDato.getMonth() + 1}` : `${tmpDato.getMonth() + 1}`;
    const years = tmpDato.getFullYear();

    return `${days}.${months}.${years}`;
};

export const getNowAsISODate = () => {
    return moment.unix(0).toISOString();
};

export const datePickerToISODate = (dato: string) => {
    const now = moment();
    const parsetDato = moment(dato, 'YYYY-MM-DD', true).set({
        hour: now.hour(),
        minute: now.minute(),
        second: now.second(),
    });

    return parsetDato.isValid() ? parsetDato.toISOString(true) : '';
};

function formatter(dato: string, format: string) {
    if (dato) {
        const datoVerdi = moment(dato);
        return datoVerdi.isValid() ? datoVerdi.format(format).toLowerCase() : undefined;
    }
    return undefined;
}

export function formaterDatoTid(dato: string) {
    return formatter(dato, 'DD.MM.YYYY HH:mm');
}

export function formaterDatoManed(dato: string) {
    return formatter(dato, 'DD. MMMM YYYY');
}

export function formaterDatoKortManed(dato: string) {
    return formatter(dato, 'DD. MMM YYYY');
}

export function formaterDatoKortManedTid(dato: string) {
    return formatter(dato, 'DD. MMM YYYY [kl] HH:mm');
}

export function formaterTid(dato: string) {
    return formatter(dato, 'HH:mm');
}

export function formaterDatoTidSiden(dato: string) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid() ? `for ${datoVerdi.fromNow()}` : undefined;
}

function erMerEnntoDagerSiden(dato: string) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid() ? datoVerdi.isAfter(moment().subtract(2, 'days').startOf('day'), 'd') : false;
}

export function erMerEnnSyvDagerTil(dato: string) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid() ? datoVerdi.isAfter(moment().add(7, 'days').startOf('day'), 'd') : false;
}

export function formaterDatoEllerTidSiden(dato: string) {
    const datoVerdi = moment(dato);

    if (datoVerdi.isValid()) {
        if (erMerEnntoDagerSiden(dato)) {
            return formaterDatoTidSiden(dato);
        }
        return formaterDatoKortManedTid(dato);
    }
    return undefined;
}

export function datoComparator(a, b) {
    return a && b ? moment(a).diff(b) : oneIfPresent(a) - oneIfPresent(b);
}

const oneIfPresent = (x: any): 1 | 0 => (x ? 1 : 0);

export function HiddenIf({ hidden, children }: { hidden: boolean; children: ReactChildren }) {
    if (hidden) {
        return null;
    }
    return children;
}

export function dagerTil(dato: string) {
    return moment(dato).startOf('day').diff(moment().startOf('day'), 'day');
}

function erGCP() {
    return window.location.hostname.endsWith('intern.nav.no');
}

export function getContextPath() {
    return erGCP() ? '' : '/veilarbpersonflatefs';
}
