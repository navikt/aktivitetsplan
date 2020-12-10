import { getFodselsnummer } from '../bootstrap/fnr-util';
import { Mal, Me, OppfolgingStatus } from '../datatypes/oppfolgingTypes';
import { OPPFOLGING_BASE_URL } from '../environment';
import { fetchToJson, postAsJson } from './utils';

export const fetchIdentitet = (): Promise<Me> => fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/me`);

export const settDigital = (): Promise<OppfolgingStatus> => postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/settDigital`);

export const fetchOppfolging = (): Promise<OppfolgingStatus> => fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging`);

export const fetchMal = (): Promise<Mal> => fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/mal`);

export const fetchMalListe = (): Promise<Mal[]> => fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/malListe`);

export const lagreMal = (mal: any): Promise<Mal> => postAsJson(`${OPPFOLGING_BASE_URL}/oppfolging/mal`, mal);

export const fetchHarFlereAktorId = (): Promise<boolean> =>
    fetchToJson(`${OPPFOLGING_BASE_URL}/oppfolging/harFlereAktorIderMedOppfolging`);

export const doLesAktivitetsplan = () => {
    const fnr = getFodselsnummer();
    return postAsJson(`${OPPFOLGING_BASE_URL}/${fnr}/lestaktivitetsplan`);
};
