import { Aktivitet } from '../datatypes/aktivitetTypes';
import { ArenaEtikett } from '../datatypes/arenaAktivitetTypes';

export const getAktivitetTypeTekst = (aktivitet: Aktivitet) => {
    if (aktivitet.eksternAktivitetData) {
        return eksternAktivitetTypeMap[aktivitet.eksternAktivitetData.type];
    }
    return aktivitetTypeMap[aktivitet.type];
};

export const eksternAktivitetTypeMap = {
    ARENA_TILTAK: 'Tiltak gjennom NAV',
    MIDL_LONNSTILSKUDD: 'Avtale midlertidig lønnstilskudd',
};

export const aktivitetTypeMap = {
    EGEN: 'Jobbrettet egenaktivitet',
    STILLING: 'Stilling',
    TILTAKSAKTIVITET: 'Tiltak gjennom NAV',
    GRUPPEAKTIVITET: 'Gruppeaktivitet',
    UTDANNINGSAKTIVITET: 'Utdanning',
    SOKEAVTALE: 'Jobbsøking',
    IJOBB: 'Jobb jeg har nå',
    BEHANDLING: 'Behandling',
    MOTE: 'Møte med NAV',
    SAMTALEREFERAT: 'Samtalereferat',
    STILLING_FRA_NAV: 'Stilling fra NAV',
};

export const aktivitetStatusMap = {
    PLANLAGT: 'Planlegger',
    BRUKER_ER_INTERESSERT: 'Forslag',
    GJENNOMFORES: 'Gjennomfører',
    FULLFORT: 'Fullført',
    AVBRUTT: 'Avbrutt',
};

export const avtaltMapper = {
    avtaltMedNav: 'Avtalt med NAV',
    ikkeAvtaltMedNav: 'Ikke avtalt med NAV',
};

export const stillingsEtikettMapper = {
    INGEN_VALGT: 'Ingen',
    SOKNAD_SENDT: 'Søknaden er sendt',
    INNKALT_TIL_INTERVJU: 'Skal på intervju',
    AVSLAG: 'Fått avslag',
    JOBBTILBUD: 'Fått jobbtilbud',
};

export const stillingFraNavSoknadsstatusMapper = {
    VENTER: 'Venter på å bli kontaktet',
    CV_DELT: 'CV er delt med arbeidsgiver',
    SKAL_PAA_INTERVJU: 'Skal på intervju',
    JOBBTILBUD: 'Fått jobbtilbud',
    AVSLAG: 'Ikke fått jobben',
    IKKE_FATT_JOBBEN: 'Ikke fått jobben',
};

export const tiltakEtikettMapper = {
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
