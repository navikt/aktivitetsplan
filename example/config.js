import React from "react";

export const API_BASE_URL = '/veilarbaktivitetsplanfs/api';
export const DIALOG_BASE_URL = '/veilarbdialog/api';
export const AKTIVITET_PROXY_BASE_URL = '/veilarbaktivitet/api';
export const SITUASJON_PROXY_BASE_URL = '/veilarbsituasjon/api';

export const CONTEXT_PATH = "/aktivitetsplanfelles";

export const TILLAT_SLETTING = true;

export const getDynamicBasePath = () => {
    return null;
};

export const fetchInterceptor = function (fetch, url, config) {
    const fetchUrl = `${url}${url.indexOf('?') >= 0 ? '&' : '?'}fnr=10108000398`;
    console.log("fetch: " + fetchUrl, config);
    return fetch(fetchUrl, config);
};
