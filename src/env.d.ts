interface ImportMetaEnv {
    readonly MODE: string;
    readonly BASE_URL: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
    readonly VITE_USE_HASH_ROUTER: string | undefined;
    readonly VITE_DEKORATOR_URL: string;
    readonly VITE_STILLING_FRA_NAV_BASE_URL: string;
    readonly VITE_MINSIDE_URL: string;
    readonly VITE_ARBEIDSSOKERREGISTRERING_URL: string;
    readonly VITE_ARBEIDSRETTET_DIALOG_URL: string;
    readonly VITE_API_URL_BASE: string;
    readonly VITE_SENTRY_RELEASE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
