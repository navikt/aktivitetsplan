export interface Me {
    erBruker: boolean;
    erVeileder: boolean;
    id: string;
}

export interface OppfolgingStatus {
    fnr: string;
    aktorId: string;
    veilederId: string;
    reservasjonKRR: boolean;
    kanVarsles: boolean;
    manuell: boolean;
    underOppfolging: boolean;
    underKvp: boolean;

    gjeldendeEskaleringsvarsel: Eskaleringsvarsel;
    kanStarteOppfolging: boolean;

    oppfolgingsPerioder: OppfolgingsPeriode;
    harSkriveTilgang: boolean;
    inaktivIArena: boolean;
    kanReaktiveres: boolean;
    inaktiveringsdato: Date;
    erSykmeldtMedArbeidsgiver: boolean;
    servicegruppe: string;
    formidlingsgruppe: string;
    rettighetsgruppe: string;
}

export interface OppfolgingsPeriode {
    string: string;
    begrunnelse: string;
    kvpPerioder?: KvpPeriode[];
    sluttDato?: string;
    startDato: string;
    veileder?: string;
}

interface Eskaleringsvarsel {
    varselId: string;
    aktorId: string;
    opprettetAv: string;
    opprettetDato: string;
    avsluttetDato: string;
    tilhorendeDialogId: string;
}

export interface KvpPeriode {
    opprettetDato: string;
    avsluttetDato?: string;
}

export interface Mal {
    mal: string;
    endretAv: string;
    dato: string;
    lest?: boolean;
}
