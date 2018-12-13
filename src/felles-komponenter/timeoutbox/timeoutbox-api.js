import { fetchToJson } from '../../ducks/utils';

// eslint-disable-next-line import/prefer-default-export
export function hentGjenstaendeInnloggetTid() {
    return fetchToJson('/aktivitetsplan/api/auth');
}
