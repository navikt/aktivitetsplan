import { getFodselsnummer } from '../bootstrap/fnr-util';
import { Mal, Me, OppfolgingStatus } from '../datatypes/oppfolgingTypes';
import { OPPFOLGING_BASE_URL } from '../environment';
import { fetchToJson, postAsJson } from './utils';

export const fetchIdentitet = (): Me => fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/me`);

export const settDigital = (): OppfolgingStatus => postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/settDigital`);

export const fetchOppfolging = (): OppfolgingStatus => fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging`);

export const fetchMal = (): Mal => fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/mal`);

export const fetchMalListe = (): Mal[] => fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/malListe`);

export const lagreMal = (mal: any): Mal => postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/mal`, mal);

export const doLesAktivitetsplan = () => {
    const fnr = getFodselsnummer();
    return postAsJson(`${OPPFOLGING_BASE_URL}/${fnr}/lestaktivitetsplan`);
};
