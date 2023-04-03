import { AuthInfoResponse } from '../datatypes/types';
import { fetchToJson } from './utils';

export const fetchAuthInfo = (): Promise<AuthInfoResponse> => fetchToJson('/auth/info');
