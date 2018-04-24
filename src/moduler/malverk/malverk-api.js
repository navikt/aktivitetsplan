import { MALVERK_BASE_URL } from '../../environment';
import { postAsJson } from '../../ducks/utils';

export function hentMalverkMedType(type) {
    return postAsJson(`${MALVERK_BASE_URL}/mal`, { type });
}

export default {};
