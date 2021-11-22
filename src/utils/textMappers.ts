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

export const etikettMapper = {
    INGEN_VALGT: 'Ingen',
    SOKNAD_SENDT: 'Søknaden er sendt',
    INNKALT_TIL_INTERVJU: 'Skal på intervju',
    AVSLAG: 'Fått avslag',
    JOBBTILBUD: 'Fått jobbtilbud',
};

export const stillingFraNavSoknadsstatusMapper = {
    VENTER: 'Venter på å bli kontaktet',
    SKAL_PAA_INTERVJU: 'Skal på intervju',
    JOBBTILBUD: 'Fått jobbtilbud',
    AVSLAG: 'Fått avslag',
};

export const arenaEtikettMapper = {
    AKTUELL: 'Søkt inn på tiltaket',
    AVSLAG: 'Fått avslag',
    IKKAKTUELL: 'Ikke aktuell for tiltaket',
    IKKEM: 'Ikke møtt på tiltaket',
    INFOMOETE: 'Infomøte før tiltaket',
    JATAKK: 'Takket ja til tilbud',
    NEITAKK: 'Takket nei til tilbud',
    TILBUD: 'Fått plass på tiltaket',
    VENTELISTE: 'På venteliste',
};
