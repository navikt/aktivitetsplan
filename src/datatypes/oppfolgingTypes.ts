export interface Me {
    erBruker: boolean;
    erVeileder: boolean;
    id: string;
}

export interface OppfolgingStatus {
    aktorId: string;
    avslutningsStatus: null | string;
    fnr: string;
    formidlingsgruppe: string;
    harSkriveTilgang: boolean;
    inaktivIArena: boolean;
    inaktiveringsdato: Date | null;
    kanReaktiveres: boolean;
    kanStarteOppfolging: boolean;
    kanVarsles: boolean;
    manuell: boolean;
    oppfolgingUtgang: null;
    oppfolgingsPerioder: OppfolgingsPeriode[];
    erSykmeldtMedArbeidsgiver: boolean;
    reservasjonKRR: boolean;
    rettighetsgruppe: string;
    servicegruppe: string;
    underKvp: boolean;
    underOppfolging: boolean;
    veilederId: string | null;
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
