import { FEATURE_BASE_URL } from '../environment';
import { fetchToJson } from './../ducks/utils';

export function hentFeature() {
    return fetchToJson(FEATURE_BASE_URL);
}

export default {};
