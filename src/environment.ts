const removeHostPartOfUrl = (fullUrl: string) => {
    if (import.meta.env.MODE === 'test') return fullUrl;
    if (fullUrl.length < 2) return fullUrl;
    const pathParts = fullUrl.replace('https://', '').replace('http://', '').split('/');
    if (pathParts.length === 1) return '/';
    return [...pathParts.slice(1)].join('/');
};

export const BASE_URL = removeHostPartOfUrl(import.meta.env.VITE_API_URL_BASE ?? '/');

const erGHpages = import.meta.env.VITE_USE_HASH_ROUTER === 'true';

const stripPrependingSlash = (url: string) => {
    if (erGHpages) return '';

    return url.startsWith('/') ? url.slice(1) : url;
};
export const DIALOG_BASE_URL = stripPrependingSlash(BASE_URL) + '/veilarbdialog/api';
export const AKTIVITET_BASE_URL = stripPrependingSlash(BASE_URL) + '/veilarbaktivitet/api';
export const AKTIVITET_GRAPHQL_BASE_URL = stripPrependingSlash(BASE_URL) + '/veilarbaktivitet/graphql';
export const DIALOG_GRAPHQL_BASE_URL = stripPrependingSlash(BASE_URL) + '/veilarbdialog/graphql';
export const OPPFOLGING_BASE_URL = stripPrependingSlash(BASE_URL) + '/veilarboppfolging/api';
export const VEILARBLEST_BASE_URL = stripPrependingSlash(BASE_URL) + '/veilarblest/api';
export const PERSON_BASE_URL = stripPrependingSlash(BASE_URL) + '/veilarbperson/api';
export const MALVERK_BASE_URL = stripPrependingSlash(BASE_URL) + '/veilarbmalverk/api';
export const VEILEDER_BASE_URL = stripPrependingSlash(BASE_URL) + '/veilarbveileder/api';
