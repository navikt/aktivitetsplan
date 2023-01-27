import { BrukerType } from '../../../../datatypes/aktivitetTypes';

export const hentBrukeravhengigTekst = (erBruker: boolean, endretAvType: BrukerType, endretAv?: string) => {
    let brukeravhengigTekst;

    if (erBruker) {
        if (endretAvType === 'BRUKER') {
            brukeravhengigTekst = 'Du';
        } else {
            brukeravhengigTekst = 'NAV';
        }
    } else {
        if (endretAvType === 'NAV') {
            brukeravhengigTekst = endretAv ? endretAv : 'NAV';
        } else {
            brukeravhengigTekst = 'Bruker';
        }
    }
    return brukeravhengigTekst;
};
