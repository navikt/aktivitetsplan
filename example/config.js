import React from "react";

export const API_BASE_URL = '/veilarbaktivitetsplanfs/api';
export const AKTIVITET_PROXY_BASE_URL = '/veilarbaktivitet/api';
export const SITUASJON_PROXY_BASE_URL = '/veilarbsituasjon/api';

export const CONTEXT_PATH = "/aktivitetsplanfelles";

export const getDynamicBasePath = () => {
    return null;
};

const aktiviteter = {
    id: "1",
    tittel: "asdfasdf",
    type: "EGEN",
    lenke: "https://www.nav.no",
    status: "PLANLAGT",
    beskrivelse: "Beskrivelse med\t\t tab og \n\nlinjeskift.",
    tagger: [{
        type: "ok",
        tag: "Søknad sendt"
    }]
};

const etiketter = [{"id":"SOEKNAD_SENDT","type":"ok","visningsTekst":"Søknad sendt"},{"id":"INNKALDT_TIL_INTERVJU","type":"info","visningsTekst":"Innkalt til intervju"},{"id":"AVSLAG","type":"varsling","visningsTekst":"Avslag"},{"id":"JOBBTILBUD","type":"ok","visningsTekst":"Jobbtilbud"}];

const mockData = {
    "/veilarbsituasjon/api/situasjon/vilkar": {text: "<h2>Dette er vilkårene!</h2>"},
    "/veilarbsituasjon/api/situasjon": {fnr: "10108000398", reservasjonKRR: false, manuell: false, underOppfolging: false, vilkarMaBesvares: false, oppfolgingUtgang: null},
    "/veilarbaktivitet/api/aktivitet": {aktiviteter: [aktiviteter]},
    "/veilarbaktivitet/api/aktivitet/etiketter" : etiketter,
    "/veilarbaktivitet/api/aktivitet/1/endringslogg": [{"endringsBeskrivelse":"livslopsendring, {\"fraStatus\": \"PLANLAGT\", \"tilStatus\": \"GJENNOMFORT\"}","endretAv":"1010800039824","endretDato":1490085292048}]
};

const FETCH_DELAY = 0;
export const fetchInterceptor = function (fetch, url, config) {
    console.log("fetch: " + url + " - delay=" + FETCH_DELAY, config);
    return new Promise((resolve, reject) => {
        // Timeout
        setTimeout(() => {
            if (false) {
                reject();
            }

            const data = mockData[url] || {};
            console.log("response: " + url, data);
            resolve({
                status: 200,
                ok: true,
                json: () => data
            });

        }, FETCH_DELAY);
    });
};
