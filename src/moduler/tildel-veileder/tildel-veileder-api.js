import { postAsJson } from '../../ducks/utils';
import { OPPFOLGING_BASE_URL } from '../../environment';

export function tildordneVeileder(tilordninger) {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/tilordneveileder`, {
        tilordninger,
    }).then(json => {
        const feil = json.feilendeTilordninger;
        if (feil && feil.length > 0) {
            return Promise.reject(feil);
        }
        return json;
    });
}

export default {};
