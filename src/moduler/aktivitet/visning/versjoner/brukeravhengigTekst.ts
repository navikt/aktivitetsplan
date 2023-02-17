import { BrukerType } from '../../../../datatypes/aktivitetTypes';

function getBrukerTekst(endretAvType: BrukerType): string {
    switch (endretAvType) {
        case 'BRUKER':
            return 'Du';
        case 'NAV':
        case 'SYSTEM':
        case 'ARENAIDENT':
            return 'NAV';
        case 'ARBEIDSGIVER':
            return 'Arbeidsgiver';
        case 'TILTAKSARRANGOER':
            return 'Tiltaksarrangør';
    }
}

function veilerdTekst(endretAvType: BrukerType, endretAv: string | undefined): string {
        switch (endretAvType) {
        case 'BRUKER':
            return 'Bruker';
        case 'SYSTEM':
            return 'NAV'
        case 'NAV':
        case 'ARENAIDENT':
            return endretAv ? endretAv : 'NAV';
        case 'ARBEIDSGIVER':
            return 'Arbeidsgiver ' + (endretAv ? endretAv : '');
        case 'TILTAKSARRANGOER':
            return 'Tiltaksarrangør ' + (endretAv ? endretAv : '');
        }
}

export const hentBrukeravhengigTekst = (erBruker: boolean, endretAvType: BrukerType, endretAv?: string): string => {
    if (erBruker) {
        return getBrukerTekst(endretAvType);
    } else {
        return veilerdTekst(endretAvType, endretAv);
    }
}
