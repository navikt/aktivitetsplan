import { VeilederInfo } from '../datatypes/types';
import { VEILEDER_BASE_URL } from '../environment';
import { getAsJson } from './utils';

export const fetchVeilederInfo = (): Promise<VeilederInfo> =>
    getAsJson(`${VEILEDER_BASE_URL}/veileder/me`, 'fetchVeilederInfo');
