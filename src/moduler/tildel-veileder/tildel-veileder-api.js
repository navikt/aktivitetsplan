import { postAsJson } from '../../ducks/utils';
import { OPPFOLGING_BASE_URL } from '../../environment';

export function tildordneVeileder(tilordninger) {
    return postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/tilordneveileder`, {
        tilordninger,
    }).then(json => {
        const feil = json.feilendeTilordninger;
        if (feil && feil.length > 0) {
            const feilmld = {
                id: null,
                type: 'TILDELING-FEILET-VEILEDER-ALLEREDE-SATT',
                detaljer: null,
            };
            const error = new Error('TILDEL-VEILEDER/FEILET');
            error.response = new Response(JSON.stringify(feilmld));
            throw error;
        }
        return json;
    });
}

export default {};
