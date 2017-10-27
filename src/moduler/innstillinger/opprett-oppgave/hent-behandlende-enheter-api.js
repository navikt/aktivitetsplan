import { OPPGAVE_BASE_URL } from '../../../environment';
import { fetchToJson, postAsJson } from '../../../ducks/utils';

export function hentBehandlendeEnheter(tema) {
    return fetchToJson(`${OPPGAVE_BASE_URL}/enheter/?&tema=${tema}`);
}
export function opprettOppgaveForBruker(body) {
    return postAsJson(`${OPPGAVE_BASE_URL}/oppgave`, body);
}
