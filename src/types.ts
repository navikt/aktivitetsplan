export type brukertype = 'VEILEDER' | 'BRUKER';
//aktivitetType definisjonen bor også i .\const som *_AKTIVITET_TYPE finens det noen smartere måte å gjøre dette på?
export type AktivitetType =
    | 'EGEN'
    | 'STILLING'
    | 'TILTAKSAKTIVITET'
    | 'GRUPPEAKTIVITET'
    | 'UTDANNINGSAKTIVITET'
    | 'SOKEAVTALE'
    | 'IJOBB'
    | 'BEHANDLING'
    | 'MOTE'
    | 'SAMTALEREFERAT';
//aktivitetStatusd efinisjonen bor også i .\const som STATUS_*
export type AktivitetStatus = 'AVBRUTT' | 'FULLFORT' | 'GJENNOMFORES' | 'PLANLAGT' | 'BRUKER_ER_INTERESSERT';
export type etikett = 'INGEN_VALGT' | 'SOKNAD_SENDT' | 'INNKALT_TIL_INTERVJU' | 'AVSLAG' | 'JOBBTILBUD';
export interface Lest {
    tidspunkt: string;
    verdi?: string;
    ressurs: string;
}

export interface Aktivitet {
    //denne er ikke komplett
    id: string;
    tittel?: string;
    fraDato?: string;
    tilDato?: string;
    opprettetDato: string;
    endretDato?: string;
    status: AktivitetStatus;
    type: AktivitetType;
    etikett?: etikett;
    historisk?: boolean;
    lagtInnAv?: string;
    detaljer?: object;
    endretAv: string;
    beskrivelse?: string;
    avtalt?: boolean;
    erReferatPublisert?: boolean;
    nesteStatus?: AktivitetStatus;
    referat?: string;
}

export interface OppfolgingsPeriode {
    string: string;
    begrunnelse: string;
    kvpPerioder?: Array<KvpPeriode>;
    sluttDato?: string;
    startDato: string;
    veileder?: string;
}

export interface Dialog {
    id: string;
    overskrift: string;
    aktivitetId?: string;
    lest?: boolean;
    sisteDato: string;
    sisteTekst?: string;
    erLestAvBruker?: boolean;
    venterPaSvar?: boolean;
    ferdigBehandlet?: boolean;
    henvendelser?: Array<Henvendelse>;
    egenskaper?: Array<string>;
}

interface Henvendelse {
    id: string;
    dialogId: string;
    tekst: string;
    avsender: brukertype;
    avsenderId?: string;
    sendt: string;
    lest: boolean;
}

export interface Me {
    erBruker: boolean;
    erVeileder: boolean;
    id: string;
}

interface BehandlendeEnhet {
    navn?: string;
}

export interface Bruker {
    fodselsnummer?: string;
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
    sammensattNavn?: string;
    behandlendeEnhet?: BehandlendeEnhet;
    bostedsadresse?: Bostedsadresse;
}

interface Bostedsadresse {
    strukturertAdresse?: StrukturertAdresse;
}

interface StrukturertAdresse {
    Gateadresse: GateAdresse;
}

export interface Mal {
    mal: string;
    endretAv: string;
    dato: string;
}

export interface KvpPeriode {
    opprettetDato: string;
    avsluttetDato?: string;
}

interface GateAdresse {
    gatenavn?: string;
    poststed?: string;
    husbokstav?: string;
    husnummer?: string;
    postnummer?: string;
}
