import { aktivitet } from '../proptypes';
import {
    AktivitetBaseProps,
    AktivitetType,
    AlleAktiviteter,
    BrukerType,
    Livslopsstatus,
    StillingFraNavSoknadsstatus,
} from './aktivitetTypes';
import { Etikett, LenkeMedType, OppgaveLenke } from './eksternAktivitetTypes';

export type VeilarbAktivitet =
    | SamtalereferatAktivitet
    | MoteAktivitet
    | MedisinskBehandlingAktivitet
    | StillingFraNavAktivitet;

export enum VeilarbAktivitetType {
    EGEN_AKTIVITET_TYPE = 'EGEN',
    STILLING_AKTIVITET_TYPE = 'STILLING',
    SOKEAVTALE_AKTIVITET_TYPE = 'SOKEAVTALE',
    IJOBB_AKTIVITET_TYPE = 'IJOBB',
    BEHANDLING_AKTIVITET_TYPE = 'BEHANDLING',
    MOTE_TYPE = 'MOTE',
    SAMTALEREFERAT_TYPE = 'SAMTALEREFERAT',
    STILLING_FRA_NAV_TYPE = 'STILLING_FRA_NAV',
    // EKSTERN_AKTIVITET_TYPE = 'EKSTERN_AKTIVITET',
}

export interface SamtalereferatAktivitet extends AktivitetBaseProps {
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

export interface MoteAktivitet extends AktivitetBaseProps {
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

export interface StillingFraNavAktivitet extends AktivitetBaseProps {
    type: VeilarbAktivitetType.STILLING_FRA_NAV_TYPE;
    stillingFraNavData: StillingFraNavAktivitetData;
}

export interface StillingFraNavAktivitetData {
    type: VeilarbAktivitetType.STILLING_FRA_NAV_TYPE;
    cvKanDelesData?: CvKanDelesData;
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

export function isSamtaleOrMøte(aktivitet: AlleAktiviteter): aktivitet is SamtalereferatAktivitet | MoteAktivitet {
    return (
        aktivitet.type === VeilarbAktivitetType.SAMTALEREFERAT_TYPE || aktivitet.type == VeilarbAktivitetType.MOTE_TYPE
    );
}

/*
interface EksternAktivitet extends AktivitetBaseProps {
    type: VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE;
    eksternAktivitet: EksternAktivitetData;
}

export interface EksternAktivitetData {
    type: EksternAktivitetType;
    oppgave: OppgaveLenke;
    handlinger: LenkeMedType[];
    detaljer: Record<string, string>[];
    etiketter: Etikett[];
}

export enum EksternAktivitetType {
    ARENA_TILTAK_TYPE = 'ARENA_TILTAK',
    MIDL_LONNSTILSKUDD_TYPE = 'MIDL_LONNSTILSKUDD',
}
*/
