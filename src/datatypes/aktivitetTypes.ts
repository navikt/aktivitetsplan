import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../constant';
import { ArenaAktivitet } from './arenaAktivitetTypes';
import { Etikett, LenkeMedType, OppgaveLenke } from './eksternAktivitetTypes';
import { Forhaandsorientering } from './forhaandsorienteringTypes';

export enum AktivitetType {
    EGEN_AKTIVITET_TYPE = 'EGEN',
    STILLING_AKTIVITET_TYPE = 'STILLING',
    TILTAK_AKTIVITET_TYPE = 'TILTAKSAKTIVITET',
    GRUPPE_AKTIVITET_TYPE = 'GRUPPEAKTIVITET',
    UTDANNING_AKTIVITET_TYPE = 'UTDANNINGSAKTIVITET',
    SOKEAVTALE_AKTIVITET_TYPE = 'SOKEAVTALE',
    IJOBB_AKTIVITET_TYPE = 'IJOBB',
    BEHANDLING_AKTIVITET_TYPE = 'BEHANDLING',
    MOTE_TYPE = 'MOTE',
    SAMTALEREFERAT_TYPE = 'SAMTALEREFERAT',
    STILLING_FRA_NAV_TYPE = 'STILLING_FRA_NAV',
    EKSTERN_AKTIVITET_TYPE = 'EKSTERN_AKTIVITET',
}

export enum EksternAktivitetType {
    ARENA_TILTAK_TYPE = 'ARENA_TILTAK',
    MIDL_LONNSTILSKUDD_TYPE = 'MIDL_LONNSTILSKUDD',
}

export type AktivitetStatus =
    | typeof STATUS_AVBRUTT
    | typeof STATUS_FULLFOERT
    | typeof STATUS_GJENNOMFOERT
    | typeof STATUS_PLANLAGT
    | typeof STATUS_BRUKER_ER_INTRESSERT;

export type StillingsStatus = 'INGEN_VALGT' | 'SOKNAD_SENDT' | 'INNKALT_TIL_INTERVJU' | 'AVSLAG' | 'JOBBTILBUD';
export type StillingFraNavSoknadsstatus =
    | 'VENTER'
    | 'CV_DELT'
    | 'SKAL_PAA_INTERVJU'
    | 'JOBBTILBUD'
    | 'AVSLAG'
    | 'IKKE_FATT_JOBBEN';
export type Livslopsstatus =
    | 'PROVER_VARSLING'
    | 'HAR_VARSLET'
    | 'KAN_IKKE_VARSLE'
    | 'HAR_SVART'
    | 'AVBRUTT_AV_SYSTEM'
    | 'AVBRUTT_AV_BRUKER';

export enum TransaksjonsType {
    OPPRETTET = 'OPPRETTET',
    STATUS_ENDRET = 'STATUS_ENDRET',
    DETALJER_ENDRET = 'DETALJER_ENDRET',
    AVTALT = 'AVTALT',
    AVTALT_DATO_ENDRET = 'AVTALT_DATO_ENDRET',
    ETIKETT_ENDRET = 'ETIKETT_ENDRET',
    MOTE_TID_OG_STED_ENDRET = 'MOTE_TID_OG_STED_ENDRET',
    REFERAT_OPPRETTET = 'REFERAT_OPPRETTET',
    REFERAT_ENDRET = 'REFERAT_ENDRET',
    REFERAT_PUBLISERT = 'REFERAT_PUBLISERT',
    BLE_HISTORISK = 'BLE_HISTORISK',
    FORHAANDSORIENTERING_LEST = 'FORHAANDSORIENTERING_LEST',
    DEL_CV_SVART = 'DEL_CV_SVART',
    SOKNADSSTATUS_ENDRET = 'SOKNADSSTATUS_ENDRET',
    IKKE_FATT_JOBBEN = 'IKKE_FATT_JOBBEN',
}

export type BrukerType = 'NAV' | 'BRUKER';

export interface Lest {
    tidspunkt: string;
    verdi?: string;
    ressurs: string;
}

interface AktivitetRequiredProps {
    id: string;
    versjon: string;
    tittel: string;
    opprettetDato: string;
    status: AktivitetStatus;
    lagtInnAv: BrukerType;
    forhaandsorientering?: Forhaandsorientering;
    endretAv: string;
    avtalt: boolean;
    etikett?: StillingsStatus;
    transaksjonsType: TransaksjonsType;
    historisk: boolean;
    fraDato?: string;
    tilDato?: string;
    arenaAktivitet?: false;
    avsluttetBegrunnelse?: string; // TODO sjekk ut det her
}

interface EksternAktivitet extends AktivitetRequiredProps {
    type: AktivitetType.EKSTERN_AKTIVITET_TYPE;
    eksternAktivitet: EksternAktivitetData;
}

export type AlleAktiviteter = InternAktivitet | ArenaAktivitet;

export function isArenaAktivitet(aktivitet: AlleAktiviteter): aktivitet is ArenaAktivitet {
    return !!aktivitet.arenaAktivitet;
}

export function isVeilarbAktivitetAktivitet(aktivitet: AlleAktiviteter): aktivitet is InternAktivitet {
    return !aktivitet.arenaAktivitet;
}

export type InternAktivitet = SamtalereferatAktivitet | MoteAktivitet | MedisinskBehandlingAktivitet;

// export interface Aktivitet extends AktivitetRequiredProps {
//     fraDato?: string;
//     tilDato?: string;
//     endretDato?: string;
//     avsluttetKommentar?: string;
//     etikett?: StillingsStatus;
//     historisk?: boolean;
//     forhaandsorientering?: Forhaandsorientering;
//     detaljer?: object;
//     beskrivelse?: string;
//     erReferatPublisert?: boolean;
//     nesteStatus?: AktivitetStatus;
//     referat?: string;
//     arbeidsgiver?: StringOrNull;
//     antallStillingerSokes?: number;
//     antallStillingerIUken?: number;
//     arenaAktivitet?: false;
//     avsluttetBegrunnelse?: string;
// }

export interface SamtalereferatAktivitet extends AktivitetRequiredProps {
    type: AktivitetType.SAMTALEREFERAT_TYPE;
    fraDato: string;
    varighet: string;
    kanal: string;
    adresse: string;
    beskrivelse: string;
    forberedelser: string;
    referat: string;
}

export interface MoteAktivitet extends AktivitetRequiredProps {
    type: AktivitetType.MOTE_TYPE;
    fraDato: string;
    tilDato: string;
    klokkeslett: string;
    varighet: string;
    kanal: string;
    adresse: string;
    beskrivelse: string;
    forberedelser: string;
    referat: string;
}

export interface MedisinskBehandlingAktivitet extends AktivitetRequiredProps {
    type: AktivitetType.BEHANDLING_AKTIVITET_TYPE;
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

export interface StillingFraNavAktivitetData {
    type: AktivitetType.STILLING_FRA_NAV_TYPE;
    cvKanDelesData: CvKanDelesData;
    soknadsfrist: string;
    svarfrist: string;
    arbeidsgiver: string;
    bestillingsId: string;
    stillingsId: string;
    arbeidssted: string;
    varselId: string;
    lenke: string; //mangler i backend
    kontaktpersonData: KontaktInfo;
    soknadsstatus: StillingFraNavSoknadsstatus;
    livslopsstatus: Livslopsstatus;
    ikkefattjobbendetaljer: string;
}

export interface CvKanDelesData {
    kanDeles: boolean;
    endretTidspunkt: Date;
    avtaltDato: Date;
    endretAv: string;
    endretAvType: BrukerType;
}

export interface EksternAktivitetData {
    type: EksternAktivitetType;
    oppgave: OppgaveLenke;
    handlinger: LenkeMedType[];
    detaljer: Record<string, string>[];
    etiketter: Etikett[];
}
