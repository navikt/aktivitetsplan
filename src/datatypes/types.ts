export type brukertype = 'VEILEDER' | 'BRUKER';

interface GeografiskEnhet {
    navn?: string;
}

export interface Bruker {
    fodselsnummer?: string;
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
    geografiskEnhet?: GeografiskEnhet;
}

export interface RegoppslagDto {
    navn: string;
    adresse: Postadresse;
}

export interface Postadresse {
    type: string;
    adresselinje1: string;
    adresselinje2?: string;
    adresselinje3?: string;
    postnummer?: string;
    poststed?: string;
    landkode: string;
    land: string;
}

export interface VeilederInfo {
    ident: string;
    navn: string;
    fornavn: string;
    etternavn: string;
}

export interface TabChangeEvent {
    tabId: string;
}
