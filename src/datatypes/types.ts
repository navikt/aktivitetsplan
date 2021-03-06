export type brukertype = 'VEILEDER' | 'BRUKER';

interface GeografiskEnhet {
    navn?: string;
}

export interface Bruker {
    fodselsnummer?: string;
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
    sammensattNavn?: string;
    geografiskEnhet?: GeografiskEnhet;
    bostedsadresse?: Bostedsadresse;
}

interface Bostedsadresse {
    strukturertAdresse?: StrukturertAdresse;
}

interface StrukturertAdresse {
    Gateadresse: GateAdresse;
}

interface GateAdresse {
    gatenavn?: string;
    poststed?: string;
    husbokstav?: string;
    husnummer?: string;
    postnummer?: string;
}
