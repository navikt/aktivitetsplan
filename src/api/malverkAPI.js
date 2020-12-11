import { MALVERK_BASE_URL } from '../environment';
import { postAsJson } from './utils';

export function hentMalverkMedType(type) {
    return postAsJson(`${MALVERK_BASE_URL}/mal`, { type });
}
