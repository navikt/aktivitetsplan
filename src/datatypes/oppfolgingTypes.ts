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
    uuid: string;
    begrunnelse: string | null;
    kvpPerioder?: KvpPeriode[];
    sluttDato?: string | null;
    startDato: string;
    veileder?: string | null;
}
export type AvsluttetOppfolgingsPeriode = OppfolgingsPeriode & { sluttDato: string };

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
