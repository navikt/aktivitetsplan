export const CONTEXT_PATH = '/aktivitetsplan';
export const API_BASE_URL = '/aktivitetsplan/api';

export const VIS_MALER = false;
export const getDynamicBasePath = () => null;

export const fetchInterceptor = (fetch, url, config) => fetch(url, config);
