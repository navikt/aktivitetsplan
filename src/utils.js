//TODO: konvertere dato stuff til date-fns og flytte til dateUtils.ts

import moment from 'moment';

export function fn(value) {
    return typeof value === 'function' ? value : () => value;
}

export const msSince = (date) => moment().unix() - moment(date).unix();

export function autobind(ctx) {
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

export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function erInternlenke(href) {
    return !!href && !href.startsWith('http://') && !href.startsWith('https://');
}

export function storeForbokstaver(...tekster) {
    const tekst = tekster.filter((s) => s).join(' ');

    return tekst
        .split(' ')
        .map((ord) => ord.charAt(0).toUpperCase() + ord.slice(1).toLowerCase())
        .join(' ');
}

export const erGyldigISODato = (isoDato) => {
    return !!(isoDato && moment(isoDato, moment.ISO_8601).isValid());
};

const erLocalDate = (dato) => {
    return dato.year && dato.monthValue && dato.dayOfMonth;
};

export const toDate = (dato) => {
    if (typeof dato === 'undefined' || dato === null) {
        return null;
    }
    return erLocalDate(dato) ? new Date(dato.year, dato.monthValue - 1, dato.dayOfMonth) : new Date(dato);
};

export const toDatePrettyPrint = (dato) => {
    if (typeof dato === 'undefined' || dato === null) {
        return null;
    }

    const tmpDato = toDate(dato);

    const days = tmpDato.getDate() < 10 ? `0${tmpDato.getDate()}` : `${tmpDato.getDate()}`;
    const months = tmpDato.getMonth() + 1 < 10 ? `0${tmpDato.getMonth() + 1}` : `${tmpDato.getMonth() + 1}`;
    const years = tmpDato.getFullYear();

    return `${days}.${months}.${years}`;
};

export const getNowAsISODate = () => {
    return moment.unix(0).toISOString();
};

export const datePickerToISODate = (dato) => {
    const now = moment();
    const parsetDato = moment(dato, 'YYYY-MM-DD', true).set({
        hour: now.hour(),
        minute: now.minute(),
        second: now.second(),
    });

    return parsetDato.isValid() ? parsetDato.toISOString(true) : '';
};

function formatter(dato, format) {
    if (dato) {
        const datoVerdi = moment(dato);
        return datoVerdi.isValid() ? datoVerdi.format(format) : undefined;
    }
    return undefined;
}

export function formaterDatoTid(dato) {
    return formatter(dato, 'DD.MM.YYYY HH:mm');
}

export function formaterDatoManed(dato) {
    return formatter(dato, 'Do MMMM YYYY');
}

export function formaterDatoKortManed(dato) {
    return formatter(dato, 'Do MMM YYYY');
}

export function formaterDatoKortManedTid(dato) {
    return formatter(dato, 'Do MMM YYYY [kl] HH:mm');
}

export function formaterTid(dato) {
    return formatter(dato, 'HH:mm');
}

export function formaterDatoTidSiden(dato) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid() ? `for ${datoVerdi.fromNow()}` : undefined;
}

function erMerEnntoDagerSiden(dato) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid ? datoVerdi.isAfter(moment().subtract(2, 'days').startOf('day'), 'd') : false;
}

export function erMerEnnSyvDagerTil(dato) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid ? datoVerdi.isAfter(moment().add(7, 'days').startOf('day'), 'd') : false;
}

export function erMerEnnEnManederSiden(aktivitet) {
    const datoVerdi = aktivitet.tilDato ? moment(aktivitet.tilDato) : moment(aktivitet.endretDato);
    return datoVerdi.isValid ? datoVerdi.isBefore(moment().subtract(1, 'month').startOf('day'), 'd') : false;
}

export function formaterDatoEllerTidSiden(dato) {
    const datoVerdi = moment(dato);

    if (datoVerdi.isValid) {
        if (erMerEnntoDagerSiden(dato)) {
            return formaterDatoTidSiden(dato);
        }
        return formaterDatoKortManedTid(dato);
    }
    return undefined;
}

export function formaterDatoEllerTidSidenUtenKlokkeslett(dato) {
    const datoVerdi = moment(dato);

    if (datoVerdi.isValid()) {
        if (erMerEnntoDagerSiden(dato)) {
            return formaterDatoTidSiden(dato);
        }
        return formaterDatoKortManed(dato);
    }
    return undefined;
}

export function datoComparator(a, b) {
    return a && b ? moment(a).diff(b) : (a ? 1 : 0) - (b ? 1 : 0);
}

export function HiddenIf({ hidden, children }) {
    if (hidden) {
        return null;
    }
    return children;
}

export function dagerTil(dato) {
    return moment(dato).startOf('day').diff(moment().startOf('day'), 'day');
}

function erGCP() {
    return window.location.hostname.endsWith('intern.nav.no');
}

export function getContextPath() {
    return erGCP() ? '' : '/veilarbpersonflatefs';
}
