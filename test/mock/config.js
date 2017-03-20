import React from "react";

export const API_BASE_URL = '/veilarbaktivitetsplanfs/api';
export const AKTIVITET_PROXY_BASE_URL = '/veilarbaktivitet/api';
export const SITUASJON_PROXY_BASE_URL = '/veilarbsituasjon/api';

export const CONTEXT_PATH = "/test";

export const IKKE_VIS_SIDEBANNER = false;
export const INGEN_SJEKK_AV_VILKAR = false;

export const getDynamicBasePath = () => {
    return null;
};

export const fetchInterceptor = function (fetch, url, config) {
    return fetch(url,config);
};
