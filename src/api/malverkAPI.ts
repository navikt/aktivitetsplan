import { MALVERK_BASE_URL } from '../environment';
import { postAsJson } from './utils';

export const hentMalverkMedType = () => postAsJson(`${MALVERK_BASE_URL}/mal`, { type: 'EGEN' });
