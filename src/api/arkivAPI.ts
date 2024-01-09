import { ARKIV_BASE_URL } from '../environment';
import { postAsJson } from './utils';

export const arkiver = () => postAsJson(`${ARKIV_BASE_URL}/arkiver`, {});
