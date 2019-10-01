export type brukertype = "VEILEDER" | "BRUKER"

export interface Lest {
    tidspunkt: string,
    verdi?: string,
    ressurs: string,
}

export interface OppfolgingsPeriode {
    string: string
    begrunnelse: string
    kvpPerioder?: Array<object>
    sluttDato?: string
    startDato: string
    veileder?: string
}

export interface Dialog {
    id: string,
    overskrift: string,
    aktivitetId?: string,
    lest?: boolean,
    sisteDato?: string,
    sisteTekst?: string,
    erLestAvBruker?: boolean,
    venterPaSvar?: boolean,
    ferdigBehandlet?: boolean,
    henvendelser: Array<Henvendelse>,
    egenskaper?: Array<string>,
}

interface Henvendelse {
    dialogId: string,
    tekst: string,
    avsender: brukertype,
    avsenderId?: string,
    sendt: string,
    lest: boolean,
}
