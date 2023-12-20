import { VeilederInfo } from '../datatypes/types';
import { VEILEDER_BASE_URL } from '../environment';
import { fetchToJson } from './utils';

// Bare veileder
export const fetchVeilederInfo = (): Promise<VeilederInfo> =>
    fetchToJson(undefined, `${VEILEDER_BASE_URL}/veileder/me`);
