import {
    AktivitetBaseProps,
    AlleAktiviteter,
    BrukerType,
    Livslopsstatus,
    StillingFraNavSoknadsstatus,
} from './aktivitetTypes';
import { Detalj, Etikett, LenkeMedType, OppgaveLenke } from './eksternAktivitetTypes';
import {
    FellesTransaksjonsTyper,
    MoteTransaksjonsType,
    SamtaleReferatTransaksjonsType,
    StillingFraNavTransaksjonsType,
    StillingTransaksjonsType,
} from './transaksjonstyperTypes';

export type VeilarbAktivitet =
    | SamtalereferatAktivitet
    | MoteAktivitet
    | StillingAktivitet
    | SokeavtaleAktivitet
    | MedisinskBehandlingAktivitet
    | StillingFraNavAktivitet
    | EgenAktivitet
    | EksternAktivitet;

export enum VeilarbAktivitetType {
    EGEN_AKTIVITET_TYPE = 'EGEN',
    STILLING_AKTIVITET_TYPE = 'STILLING',
    SOKEAVTALE_AKTIVITET_TYPE = 'SOKEAVTALE',
    IJOBB_AKTIVITET_TYPE = 'IJOBB',
    BEHANDLING_AKTIVITET_TYPE = 'BEHANDLING',
    MOTE_TYPE = 'MOTE',
    SAMTALEREFERAT_TYPE = 'SAMTALEREFERAT',
    STILLING_FRA_NAV_TYPE = 'STILLING_FRA_NAV',
    EKSTERN_AKTIVITET_TYPE = 'EKSTERNAKTIVITET',
}

export interface EgenAktivitet extends AktivitetBaseProps {
    type: VeilarbAktivitetType.EGEN_AKTIVITET_TYPE;
    hensikt?: string;
    oppfolging?: string;
}

export interface SokeavtaleAktivitet extends AktivitetBaseProps {
    type: VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE;
    antallStillingerSokes?: number;
    antallStillingerIUken?: number;
    avtaleOppfolging?: string;
}

export interface StillingAktivitet extends AktivitetBaseProps<FellesTransaksjonsTyper | StillingTransaksjonsType> {
    type: VeilarbAktivitetType.STILLING_AKTIVITET_TYPE;
    arbeidsgiver?: string;
    kontaktperson?: string;
    arbeidssted?: string;
    stillingsTittel?: string;
}

export interface SamtalereferatAktivitet
    extends AktivitetBaseProps<FellesTransaksjonsTyper | SamtaleReferatTransaksjonsType> {
    type: VeilarbAktivitetType.SAMTALEREFERAT_TYPE;
    fraDato: string;
    varighet: string;
    kanal: string;
    adresse: string;
    beskrivelse: string;
    forberedelser: string;
    referat: string;
    erReferatPublisert: boolean;
}

export interface MoteAktivitet extends AktivitetBaseProps<FellesTransaksjonsTyper | MoteTransaksjonsType> {
    type: VeilarbAktivitetType.MOTE_TYPE;
    fraDato: string;
    tilDato: string;
    klokkeslett: string;
    varighet: string;
    kanal: string;
    adresse: string;
    beskrivelse: string;
    forberedelser: string;
    referat: string;
    erReferatPublisert: boolean;
}

export interface MedisinskBehandlingAktivitet extends AktivitetBaseProps {
    type: VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE;
    fraDato: string;
    tilDato: string;
    behandlingType: string;
    behandlingSted: string;
    effekt: string; //TODO: Rename i api, mål for behandlingen
    behandlingOppfolging: string; //oppfølging fra nav, utgått
    beskrivelse: string;
}

export interface KontaktInfo {
    navn: string;
    tittel: string;
    mobil: string;
}

export interface CvKanDelesData {
    kanDeles: boolean;
    endretTidspunkt: Date;
    avtaltDato: Date;
    endretAv: string;
    endretAvType: BrukerType;
}

export interface StillingFraNavAktivitet
    extends AktivitetBaseProps<FellesTransaksjonsTyper | StillingFraNavTransaksjonsType> {
    type: VeilarbAktivitetType.STILLING_FRA_NAV_TYPE;
    stillingFraNavData: StillingFraNavAktivitetData;
}

export interface StillingFraNavAktivitetData {
    cvKanDelesData?: CvKanDelesData;
    soknadsfrist: string;
    svarfrist: string;
    arbeidsgiver: string;
    bestillingsId: string;
    stillingsId: string;
    arbeidssted: string;
    kontaktpersonData: KontaktInfo;
    soknadsstatus?: StillingFraNavSoknadsstatus;
    ikkefattjobbendetaljer?: string;
    livslopsstatus: Livslopsstatus;
}

export function isSamtaleOrMote(aktivitet: AlleAktiviteter): aktivitet is SamtalereferatAktivitet | MoteAktivitet {
    return (
        aktivitet.type === VeilarbAktivitetType.SAMTALEREFERAT_TYPE || aktivitet.type === VeilarbAktivitetType.MOTE_TYPE
    );
}

export interface EksternAktivitet extends AktivitetBaseProps {
    type: VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE;
    eksternAktivitetData: EksternAktivitetData;
}

export interface EksternAktivitetData {
    type: EksternAktivitetType;
    oppgave?: OppgaveLenke;
    handlinger?: LenkeMedType[];
    detaljer?: Detalj[];
    etiketter?: Etikett[];
}

export enum EksternAktivitetType {
    ARENA_TILTAK_TYPE = 'ARENA_TILTAK',
    MIDL_LONNSTILSKUDD_TYPE = 'MIDL_LONNSTILSKUDD',
}
