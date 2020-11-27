import { postAsJson } from '../../ducks/utils';
import { MALVERK_BASE_URL } from '../../environment';

export function hentMalverkMedType(type) {
    return postAsJson(`${MALVERK_BASE_URL}/mal`, { type });
}

export default {};
