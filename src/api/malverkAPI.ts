import { MALVERK_BASE_URL } from '../environment';
import { postAsJson } from './utils';

export const hentMalverkMedType = (type: string) => postAsJson(`${MALVERK_BASE_URL}/mal`, { type });
