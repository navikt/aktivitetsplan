import {
    AktivitetStatus,
    AktivitetType,
    AlleAktiviteter,
    JobbStatusType,
    Kanal,
    StillingFraNavSoknadsstatus,
    StillingStatus,
} from '../datatypes/aktivitetTypes';
import { ArenaEtikett } from '../datatypes/arenaAktivitetTypes';
import { EksternAktivitetType, VeilarbAktivitetType } from '../datatypes/internAktivitetTypes';

export const getAktivitetType = (aktivitet: AlleAktiviteter): string => {
    if (aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE) {
        return aktivitetTypeMap[aktivitet.eksternAktivitet.type];
    }
    return aktivitetTypeMap[aktivitet.type];
};

// EKSTERN_AKTIVITET har subtyper - sjekk EksternAktivitetType@internAktivitetTypes.ts
export type AlleAktivitetTyper =
    | Exclude<AktivitetType, VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE>
    | EksternAktivitetType;

export const aktivitetTypeMap: Record<AlleAktivitetTyper, string> = {
    EGEN: 'Jobbrettet egenaktivitet',
    STILLING: 'Stilling',
    TILTAKSAKTIVITET: 'Tiltak gjennom Nav',
    GRUPPEAKTIVITET: 'Gruppeaktivitet',
    UTDANNINGSAKTIVITET: 'Utdanning',
    SOKEAVTALE: 'Jobbsøking',
    IJOBB: 'Jobb jeg har nå',
    BEHANDLING: 'Behandling',
    MOTE: 'Møte med Nav',
    SAMTALEREFERAT: 'Samtalereferat',
    STILLING_FRA_NAV: 'Stilling fra Nav',
    ARENA_TILTAK: 'Tiltak gjennom Nav',
    MIDLERTIDIG_LONNSTILSKUDD: 'Avtale midlertidig lønnstilskudd',
    VARIG_LONNSTILSKUDD: 'Avtale varig lønnstilskudd',
    INDOPPFAG: 'Oppfølging',
    ARBFORB: 'Arbeidsforberedende trening',
    AVKLARAG: 'Avklaring',
    VASV: 'Varig tilrettelagt arbeid i skjermet virksomhet',
    ARBRRHDAG: 'Arbeidsrettet rehabilitering',
    DIGIOPPARB: 'Digitalt jobbsøkerkurs',
    JOBBK: 'Jobbklubb',
    GRUPPEAMO: 'Arbeidsmarkedsopplæring (Gruppe)',
    GRUFAGYRKE: 'Fag- og yrkesopplæring (Gruppe)',
};

export const aktivitetStatusMap: Record<AktivitetStatus, string> = {
    PLANLAGT: 'Planlegger',
    BRUKER_ER_INTERESSERT: 'Forslag',
    GJENNOMFORES: 'Gjennomfører',
    FULLFORT: 'Fullført',
    AVBRUTT: 'Avbrutt',
};

export const jobbStatusTypeMap: Record<JobbStatusType, string> = {
    DELTID: 'Deltid',
    HELTID: 'Heltid',
};

export const kanalMap: Record<Kanal, string> = {
    INTERNETT: 'Videomøte',
    OPPMOTE: 'Oppmøte',
    TELEFON: 'Telefonmøte',
};

export const avtaltMapper = {
    AVTALT_MED_NAV: 'Avtalt med Nav',
    IKKE_AVTALT_MED_NAV: 'Ikke avtalt med Nav',
};

export const stillingsEtikettMapper: Record<StillingStatus, string> = {
    INGEN_VALGT: 'Ingen',
    SOKNAD_SENDT: 'Søknaden er sendt',
    INNKALT_TIL_INTERVJU: 'Skal på intervju',
    AVSLAG: 'Ikke fått jobben',
    JOBBTILBUD: 'Fått jobbtilbud',
};

export const stillingFraNavSoknadsstatusMapper: Record<StillingFraNavSoknadsstatus, string> = {
    VENTER: 'Venter på å bli kontaktet',
    CV_DELT: 'CV er delt med arbeidsgiver',
    SKAL_PAA_INTERVJU: 'Skal på intervju',
    JOBBTILBUD: 'Fått jobbtilbud',
    AVSLAG: 'Ikke fått jobben',
    IKKE_FATT_JOBBEN: 'Ikke fått jobben',
    FATT_JOBBEN: 'Fått jobben',
};

export const stillingOgStillingFraNavEtikettMapper: Record<StillingStatus | StillingFraNavSoknadsstatus, string> = {
    ...stillingsEtikettMapper,
    ...stillingFraNavSoknadsstatusMapper,
};

export const tiltakEtikettMapper: Record<ArenaEtikett, string> = {
    [ArenaEtikett.AKTUELL]: 'Søkt inn på tiltaket',
    [ArenaEtikett.AVSLAG]: 'Fått avslag',
    [ArenaEtikett.IKKAKTUELL]: 'Ikke aktuell for tiltaket',
    [ArenaEtikett.IKKEM]: 'Ikke møtt på tiltaket',
    [ArenaEtikett.INFOMOETE]: 'Infomøte før tiltaket',
    [ArenaEtikett.JATAKK]: 'Takket ja til tilbud',
    [ArenaEtikett.NEITAKK]: 'Takket nei til tilbud',
    [ArenaEtikett.TILBUD]: 'Fått plass på tiltaket',
    [ArenaEtikett.VENTELISTE]: 'På venteliste',
};
export const eksternAktivitetFilterTextMappings = {
    SOKT_INN: 'Søkt inn på tiltaket',
    AVSLAG: 'Fått avslag',
    IKKE_AKTUELL: 'Ikke aktuell for tiltaket',
    IKKE_MOETT: 'Ikke møtt på tiltaket',
    INFOMOETE: 'Infomøte før tiltaket',
    TAKKET_JA: 'Takket ja til tilbud',
    TAKKET_NEI: 'Takket nei til tilbud',
    FATT_PLASS: 'Fått plass på tiltaket',
    VENTELISTE: 'På venteliste',
};

export const tiltakOgEksternAktivitetEtikettMapper: Record<
    ArenaEtikett | keyof typeof eksternAktivitetFilterTextMappings,
    string
> = {
    ...tiltakEtikettMapper,
    ...eksternAktivitetFilterTextMappings,
};
