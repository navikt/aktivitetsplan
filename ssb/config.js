export const CONTEXT_PATH = '/aktivitetsplan';
export const API_BASE_URL = '/aktivitetsplan/api';

export const TILLAT_SLETTING = true;
export const getDynamicBasePath = () => null;

export const fetchInterceptor = (fetch, url, config) => fetch(url, config);
