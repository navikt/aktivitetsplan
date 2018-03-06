import momentImpl from 'moment';
import 'moment-timezone';
import 'moment/locale/nb';

momentImpl.locale('nb');
momentImpl.tz.setDefault("Europe/Oslo");

export const moment = momentImpl;

export function fn(value) {
    return typeof value === 'function' ? value : () => value;
}

export function autobind(ctx) {
    Object.getOwnPropertyNames(ctx.constructor.prototype)
        .filter(prop => typeof ctx[prop] === 'function')
        .forEach(method => {
            // eslint-disable-next-line
            ctx[method] = ctx[method].bind(ctx);
        });
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString().substring(1);
}

export function guid() {
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export function mergeObject(mergeFn) {
    return (acc, element) => ({
        ...acc,
        ...mergeFn(element),
    });
}

/* eslint-disable */
export function throttle(fn, threshold = 250) {
    let last;
    let deferTimer;

    return function closure() {
        const context = this;

        const now = +new Date();
        const args = arguments;
        if (last && now < last + threshold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function() {
                last = now;
                fn.apply(context, args);
            }, threshold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}

export function erDev() {
    const url = window.location.href;
    return (
        url.includes('debug=true') ||
        url.includes('devillo.no:8282') ||
        url.includes('localhost')
    );
}

export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function erInternlenke(href) {
    return (
        !!href && !href.startsWith('http://') && !href.startsWith('https://')
    );
}

export function proxy(func, { before, after } = {}) {
    return (...args) => {
        before && before(...args);
        func && func(...args);
        after && after(...args);
    };
}

export function storeForbokstaver(...tekster) {
    const tekst = tekster.filter(s => s).join(' ');

    return tekst
        .split(' ')
        .map(ord => ord.charAt(0).toUpperCase() + ord.slice(1).toLowerCase())
        .join(' ');
}

export const erGyldigISODato = isoDato => {
    return !!(isoDato && moment(isoDato, moment.ISO_8601).isValid());
};

export const erGyldigFormattertDato = formattertDato => {
    return !!(
        formattertDato &&
        formattertDato.length === 10 &&
        moment(formattertDato, 'DD.MM.YYYY', true).isValid()
    );
};

const erLocalDate = dato => {
    return dato.year && dato.monthValue && dato.dayOfMonth;
};

export const toDate = dato => {
    if (typeof dato === 'undefined' || dato === null) {
        return null;
    }
    return erLocalDate(dato)
        ? new Date(dato.year, dato.monthValue - 1, dato.dayOfMonth)
        : new Date(dato);
};

export const toDatePrettyPrint = dato => {
    if (typeof dato === 'undefined' || dato === null) {
        return null;
    }

    const _dato = toDate(dato);

    const days =
        _dato.getDate() < 10 ? `0${_dato.getDate()}` : `${_dato.getDate()}`;
    const months =
        _dato.getMonth() + 1 < 10
            ? `0${_dato.getMonth() + 1}`
            : `${_dato.getMonth() + 1}`;
    const years = _dato.getFullYear();

    return `${days}.${months}.${years}`;
};

export const datePickerToISODate = dato => {
    const parsetDato = moment(dato, 'DD.MM.YYYY', true);
    return parsetDato.isValid() ? parsetDato.toISOString() : '';
};

export const dateToISODate = dato => {
    const parsetDato = moment(dato);
    return dato && parsetDato.isValid() ? parsetDato.toISOString() : '';
};

export const ISODateToDatePicker = dato => {
    const parsetDato = moment(dato);
    return dato && parsetDato.isValid() ? parsetDato.format('DD.MM.YYYY') : '';
};

moment.updateLocale('nb', {
    monthsShort: [
        'jan',
        'feb',
        'mar',
        'apr',
        'mai',
        'jun',
        'jul',
        'aug',
        'sep',
        'okt',
        'nov',
        'des',
    ],
});

function formatter(dato, format) {
    if (dato) {
        const datoVerdi = moment(dato);
        return datoVerdi.isValid() ? datoVerdi.format(format) : undefined;
    }
}

export function formaterDato(dato) {
    return formatter(dato, 'Do MMM YYYY');
}

export function formaterDatoTid(dato) {
    return formatter(dato, 'DD.MM.YYYY HH:mm');
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
    return datoVerdi.isValid() ? 'for ' + datoVerdi.fromNow() : undefined;
}

function erMerEnntoDagerSiden(dato) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid
        ? datoVerdi.isAfter(moment().subtract(2, 'days').startOf('day'), 'd')
        : false;
}
export function formaterDatoEllerTidSiden(dato) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid
        ? erMerEnntoDagerSiden(dato)
          ? formaterDatoTidSiden(dato)
          : formaterDatoKortManedTid(dato)
        : undefined;
}

export function formaterDatoEllerTidSidenUtenKlokkeslett(dato) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid
        ? erMerEnntoDagerSiden(dato)
          ? formaterDatoTidSiden(dato)
          : formaterDatoKortManed(dato)
        : undefined;
}

export function datoComparator(a, b) {
    return a && b ? moment(a).diff(b) : (a ? 1 : 0) - (b ? 1 : 0);
}

function pad(number) {
    return number < 10 ? `0${number}` : number;
}

export function toLocalDate(date) {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return `${dateObject.getFullYear()}-${pad(dateObject.getMonth() + 1)}-${pad(
        dateObject.getDate()
    )}`;
}

export function HiddenIf({ hidden, children }) {
    if (hidden) {
        return null;
    }
    return children;
}

export function erTidspunktIPeriode(tidspunkt, fra, til) {
    return moment(tidspunkt).isBetween(moment(fra), moment(til));
}
