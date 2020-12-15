import { fetchToJson } from './utils';

// eslint-disable-next-line import/prefer-default-export
export function hentGjenstaendeInnloggetTid() {
    return fetchToJson('/api/auth');
}
