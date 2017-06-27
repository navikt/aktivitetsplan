import React from 'react';

export const API_BASE_URL = '/veilarbaktivitetsplanfs/api';
export const DIALOG_BASE_URL = '/veilarbdialog/api';
export const AKTIVITET_PROXY_BASE_URL = '/veilarbaktivitet/api';
export const SITUASJON_PROXY_BASE_URL = '/veilarbsituasjon/api';
export const PERSON_BASE_URL = '/veilarbperson/tjenester';
export const VEILEDER_BASE_URL = '/veilarbveileder/tjenester';

export const CONTEXT_PATH = '/aktivitetsplanfelles';

export const TILLAT_SLETTING = true;

export const TILLAT_SET_AVTALT = true;

export const VIS_INNSTILLINGER = true;

export const VIS_SIDEBANNER = true;

export const EKSEMPEL_FNR = '10108000398';

export const getDynamicBasePath = () => {
    return null;
};

export const fetchInterceptor = function(fetch, url, config) {
    const fetchUrl = `${url}${url.indexOf('?') >= 0 ? '&' : '?'}fnr=${EKSEMPEL_FNR}`;
    console.log('fetch: ' + fetchUrl, config);
    return fetch(fetchUrl, config);
};
