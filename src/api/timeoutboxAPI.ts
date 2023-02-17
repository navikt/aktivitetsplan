import { fetchToJson } from './utils';

// eslint-disable-next-line import/prefer-default-export
export const hentGjenstaendeInnloggetTid = () => fetchToJson('/auth/info');
