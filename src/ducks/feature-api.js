// import { FEATURE_BASE_URL } from '../environment';
// import { fetchToJson } from './../ducks/utils';

export function hentFeature() {
    // *************************************************
    //   TODO: Dette er et midlertidig hack for å unngå
    //   sertifikat problemer med fo-feature i prod
    // *************************************************
    return new Promise(resolve => {
        resolve({
            aktivitetsplan: {
                kvp: false,
            },
            veilarbaktivitetsplanfs: {
                kvp: true,
            },
        });
    });

    // TODO: Linjen under er den som egentlig skal kjøre når hacken over er løst
    // return fetchToJson(FEATURE_BASE_URL).catch(() => {});
    // Ikke gi feilmelding hvis feature feiler, men anta alle features=false
}

export default {};
