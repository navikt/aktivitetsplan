import { OPPFOLGING_PROXY_BASE_URL } from '../../environment';
import { postAsJson } from '../../ducks/utils';

// eslint-disable-next-line import/prefer-default-export
export function settDigital() {
    return postAsJson(`${OPPFOLGING_PROXY_BASE_URL}/oppfolging/settDigital`);
}
