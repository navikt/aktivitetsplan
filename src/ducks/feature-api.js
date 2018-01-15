import { FEATURE_BASE_URL } from '../environment';
import { fetchToJson } from './../ducks/utils';

export function hentFeature() {
    return fetchToJson(FEATURE_BASE_URL).catch(() => {});
    // Ikke gi feilmelding hvis feature filer, men anta alle features=false
}

export default {};
