import { ReactElement } from 'react';
import { differenceInYears } from 'date-fns';


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

export function is18OrOlder(personNumber: string): boolean {
    const fødtFør2000 = parseInt(personNumber.charAt(6)) < 5;
    //500–999 omfatter personer født i perioden 2000–2039 eller 1854–1899
    if (fødtFør2000) return true;


    const day = parseInt(personNumber.slice(0, 2), 10);
    const month = parseInt(personNumber.slice(2, 4), 10) - 1;
    const year = parseInt(personNumber.slice(4, 6), 10) + 2000;

    const birthDate = new Date(year, month, day);
    const age = differenceInYears(new Date(), birthDate);

    return age >= 18;


}
