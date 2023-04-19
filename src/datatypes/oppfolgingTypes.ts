export interface Me {
    erBruker: boolean;
    erVeileder: boolean;
    id: string;
}

export interface OppfolgingStatus {
    fnr: string;
    aktorId: string;
    veilederId: string | null;
    reservasjonKRR: boolean;
    kanVarsles: boolean;
    manuell: boolean;
    underOppfolging: boolean;
    underKvp: boolean;

    kanStarteOppfolging: boolean;

    oppfolgingsPerioder: Oppfolgingsperiode[];
    harSkriveTilgang: boolean;
    inaktivIArena: boolean;
    kanReaktiveres: boolean;
    inaktiveringsdato: Date;
    erSykmeldtMedArbeidsgiver: boolean;
    servicegruppe: string;
    formidlingsgruppe: string;
    rettighetsgruppe: string;
}

export interface Oppfolgingsperiode {
    uuid: string;
    aktorId: string;
    veileder?: string | null;
    sluttDato?: string | null;
    startDato: string;
    begrunnelse: string | null;
    kvpPerioder?: KvpPeriode[];
}

export type HistoriskOppfolgingsperiode = Omit<Oppfolgingsperiode, 'sluttDato'> & {
    sluttDato: string;
};

export interface KvpPeriode {
    opprettetDato: string;
    avsluttetDato?: string;
}

export interface Mal {
    mal?: string;
    endretAv: string;
    dato?: string;
    lest?: boolean;
}
