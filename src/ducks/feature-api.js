import { FEATURE_BASE_URL } from '~config'; // eslint-disable-line

import { fetchToJson } from './../ducks/utils';

export function hentFeature() {
    return fetchToJson(`${FEATURE_BASE_URL}/fo-feature`);
}

export default {};
