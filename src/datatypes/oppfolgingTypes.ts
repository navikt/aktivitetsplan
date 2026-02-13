export interface Me {
    erBruker: boolean;
    erVeileder: boolean;
    id: string;
}

export interface OppfolgingStatus {
    // fnr: string;
    // aktorId: string;
    // veilederId: string | null;
    reservasjonKRR: boolean; // Flyttes - tilgjengelig
    manuell: boolean; // Flyttes - tilgjengelig
    kanVarsles: boolean; // Bør flyttes - tilgjengelig
    registrertKRR: boolean; // Bør flyttes - tilgjengelig
    underOppfolging: boolean; // Tilgjengelig på graphql
    underKvp: boolean; // Bruker flyttes - brukerstatus
    // kanStarteOppfolging: boolean;
    // oppfolgingUtgang: string | null;
    oppfolgingsPerioder: Oppfolgingsperiode[]; // Tilgjengelig på graphql

    inaktivIArena: boolean | null; // Brukers Arena-status
    kanReaktiveres: boolean; // Brukers Arena-status
    inaktiveringsdato: string; // Brukers Arena-status
    servicegruppe: string; // Brukers Arena-status

    // erSykmeldtMedArbeidsgiver: boolean;
    // formidlingsgruppe: string;
    // rettighetsgruppe: string;
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
