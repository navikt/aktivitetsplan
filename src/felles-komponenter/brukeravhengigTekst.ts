import { BrukerType } from '../datatypes/aktivitetTypes';

// Senere: fjern tekster lagtInnAv.*
export const hentBrukeravhengigTekst = (erBruker: boolean, lagtInnAv: BrukerType, endretAv?: string) => {
    let brukeravhengigTekst;

    if (erBruker) {
        if (lagtInnAv === 'BRUKER') {
            brukeravhengigTekst = 'Du';
        } else {
            brukeravhengigTekst = 'NAV';
        }
    } else {
        if (lagtInnAv === 'NAV') {
            brukeravhengigTekst = endretAv ? endretAv : 'NAV';
        } else {
            brukeravhengigTekst = 'Bruker';
        }
    }
    return brukeravhengigTekst;
};
