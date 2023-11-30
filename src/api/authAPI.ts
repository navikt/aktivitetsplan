import { AuthInfoResponse } from '../datatypes/types';
import { fetchToJson } from './utils';

// Fnr not required for this request
export const fetchAuthInfo = (): Promise<AuthInfoResponse> => fetchToJson(undefined, '/auth/info');
