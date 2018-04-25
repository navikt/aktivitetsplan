import { OPPFOLGING_BASE_URL } from '../../environment';
import { fetchToJson } from '../../ducks/utils';

export function hentOppfolgingsstatus(fnr) {
    return fetchToJson(
        `${OPPFOLGING_BASE_URL}/person/${fnr}/oppfoelgingsstatus`
    );
}

export default {};
