import { VeilederInfo } from '../datatypes/types';
import { VEILEDER_BASE_URL } from '../environment';
import { fetchToJson } from './utils';

export const fetchVeilederInfo = (): Promise<VeilederInfo> => fetchToJson(`${VEILEDER_BASE_URL}/veileder/me`);
