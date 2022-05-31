export type brukertype = 'VEILEDER' | 'BRUKER';

interface GeografiskEnhet {
    navn?: string;
}

export interface Bruker {
    fodselsnummer?: string;
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
    forkortetNavn?: string;
    geografiskEnhet?: GeografiskEnhet;
}

export interface VeilederInfo {
    ident: string;
    navn: string;
    fornavn: string;
    etternavn: string;
}
