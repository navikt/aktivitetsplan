import { fetchToJson } from './utils';

export const hentGjenstaendeInnloggetTid = () => fetchToJson('/auth/info');
