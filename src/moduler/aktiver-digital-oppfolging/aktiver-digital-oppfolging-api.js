import { SITUASJON_PROXY_BASE_URL } from '~config'; // eslint-disable-line
import { postAsJson } from '../../ducks/utils';

// eslint-disable-next-line import/prefer-default-export
export function settDigital() {
    return postAsJson(`${SITUASJON_PROXY_BASE_URL}/situasjon/settDigital`);
}
