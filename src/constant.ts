import { erEksternBruker } from './mocks/demo/sessionstorage';

export const ARBEIDSRETTET_DIALOG_URL = import.meta.env.VITE_ARBEIDSRETTET_DIALOG_URL;
export const STILLING_FRA_NAV_BASE_URL = import.meta.env.VITE_STILLING_FRA_NAV_BASE_URL;
export const ARBEIDSSOKERREGISTRERING_URL = import.meta.env.VITE_ARBEIDSSOKERREGISTRERING_URL;
export const MINSIDE_URL = import.meta.env.VITE_MINSIDE_URL;

export const USE_HASH_ROUTER = import.meta.env.VITE_USE_HASH_ROUTER === 'true';
export const USE_MOCK = import.meta.env.DEV || USE_HASH_ROUTER;

export const ER_INTERN_FLATE = !USE_MOCK
    ? ['dev-intern', 'prod-intern'].includes(import.meta.env.MODE)
    : !erEksternBruker();

export const EGEN_AKTIVITET_TYPE = 'EGEN';
export const STILLING_AKTIVITET_TYPE = 'STILLING';
export const TILTAK_AKTIVITET_TYPE = 'TILTAKSAKTIVITET';
export const GRUPPE_AKTIVITET_TYPE = 'GRUPPEAKTIVITET';
export const UTDANNING_AKTIVITET_TYPE = 'UTDANNINGSAKTIVITET';
export const SOKEAVTALE_AKTIVITET_TYPE = 'SOKEAVTALE';
export const IJOBB_AKTIVITET_TYPE = 'IJOBB';
export const BEHANDLING_AKTIVITET_TYPE = 'BEHANDLING';
export const MOTE_TYPE = 'MOTE';
export const SAMTALEREFERAT_TYPE = 'SAMTALEREFERAT';
export const STILLING_FRA_NAV_TYPE = 'STILLING_FRA_NAV';
export const EKSTERN_AKTIVITET_TYPE = 'EKSTERNAKTIVITET';

export const JOBB_STATUS_HELTID = 'HELTID';
export const JOBB_STATUS_DELTID = 'DELTID';

export const TELEFON_KANAL = 'TELEFON';
export const OPPMOTE_KANAL = 'OPPMOTE';
export const INTERNET_KANAL = 'INTERNETT';

export enum TabId {
    AKTIVITETSPLAN = 'AKTIVITETSPLAN',
    DIALOG = 'DIALOG',
    VEDTAKSSTOTTE = 'VEDTAKSSTOTTE',
    DETALJER = 'DETALJER',
    ARBEIDSMARKEDSTILTAK = 'ARBEIDSMARKEDSTILTAK',
}

export const AKTIVITETSPLAN_ROOT_NODE_ID = 'aktivitetsplan-app';
