import moment from 'moment';

moment.locale('nb');

export function fn(value) {
    return typeof value === 'function' ? value : () => value;
}

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

export function mergeObject(mergeFn) {
    return (acc, element) => ({
        ...acc,
        ...mergeFn(element)
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
            deferTimer = setTimeout(function () {
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
    return url.includes('debug=true') || url.includes('devillo.no:8282') || url.includes('localhost');
}

export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export function erInternlenke(href) {
    return !href.startsWith('http://') && !href.startsWith('https://');
}

export function proxy(func, { before, after } = {}) {
    return (...args) => {
        before && before(...args);
        func && func(...args);
        after && after(...args);
    };
}

moment.updateLocale('nb', {
    monthsShort: [
        'jan', 'feb', 'mar', 'apr', 'mai', 'jun',
        'jul', 'aug', 'sep', 'okt', 'nov', 'des'
    ]
});

export function formaterDato(dato) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid() ? datoVerdi.format('DD.MM.YYYY') : undefined;
}

export function formaterDatoTid(dato) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid() ? datoVerdi.format('DD.MM.YYYY HH:mm') : undefined;
}

export function formaterDatoKortManed(dato) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid() ? datoVerdi.format('Do MMM YYYY [kl] HH:mm') : undefined;
}

export function formaterDatoTidSiden(dato) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid() ? 'for ' + datoVerdi.fromNow() : undefined;
}

function erMerEnnEnDagSiden(dato) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid
        ? datoVerdi.isAfter(moment().subtract(1, 'days').startOf('day'), 'd')
        : false;
}
export function formaterDatoDatoEllerTidSiden(dato) {
    const datoVerdi = moment(dato);
    return datoVerdi.isValid
        ? erMerEnnEnDagSiden(dato)
            ? formaterDatoTidSiden(dato)
            : formaterDatoKortManed(dato)
        : undefined
}
