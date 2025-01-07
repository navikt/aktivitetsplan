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
    oppfolginUtgang: string;
    oppfolgingsPerioder: Oppfolgingsperiode[];
    harSkriveTilgang: boolean;
    inaktivIArena: boolean;
    kanReaktiveres: boolean;
    inaktiveringsdato: string;
    erSykmeldtMedArbeidsgiver: boolean;
    servicegruppe: string;
    formidlingsgruppe: string;
    rettighetsgruppe: string;
    registrertKRR : boolean;
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

export const erHistorisk = (
    oppfolginsPeriode: Oppfolgingsperiode,
): oppfolginsPeriode is HistoriskOppfolgingsperiode => {
    return !!oppfolginsPeriode.sluttDato;
};
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
