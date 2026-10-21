import { AuthInfoResponse } from '../datatypes/types';
import { getAsJson } from './utils';

export const fetchAuthInfo = (): Promise<AuthInfoResponse> => getAsJson('/auth/info', 'fetchAuthInfo');
