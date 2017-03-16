import React from "react";


export const API_BASE_URL = '/veilarbaktivitetsplanfs/api';
export const AKTIVITET_PROXY_BASE_URL = '/veilarbaktivitet/api';
export const SITUASJON_PROXY_BASE_URL = '/veilarbsituasjon/api';

export const CONTEXT_PATH = "/veilarbpersonflatefs";

export const IKKE_VIS_SIDEBANNER = true;
export const INGEN_SJEKK_AV_VILKAR = true;

export const getDynamicBasePath = function () {
    return "/";
};

export const fetchInterceptor = function (fetch, url, config) {
    console.log("fetch fetch fetch!!!");
    return fetch(url, config);
};
