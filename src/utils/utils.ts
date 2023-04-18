import { ReactElement } from 'react';

export function fn(value: any) {
    return typeof value === 'function' ? value : () => value;
}

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

export function HiddenIf({ hidden, children }: { hidden: boolean; children: ReactElement }): ReactElement | null {
    if (hidden) {
        return null;
    }
    return children;
}

function erGCP() {
    return window.location.hostname.endsWith('intern.nav.no');
}

export function getContextPath() {
    return erGCP() ? '' : import.meta.env.BASE_URL;
}

export const exist = <T>(thing: T | undefined): thing is T => thing !== undefined && thing !== null;
