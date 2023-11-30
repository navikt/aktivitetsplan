import { Mal, Me, OppfolgingStatus } from '../datatypes/oppfolgingTypes';
import { OPPFOLGING_BASE_URL } from '../environment';
import { fetchToJson, postAsJson } from './utils';

export const fetchIdentitet = (): Promise<Me> => fetchToJson(undefined, `${OPPFOLGING_BASE_URL}/oppfolging/me`);

export const settDigital = (fnr: string | undefined): Promise<OppfolgingStatus> =>
    postAsJson(fnr, `${OPPFOLGING_BASE_URL}/oppfolging/settDigital`);

export const fetchOppfolging = (fnr: string | undefined): Promise<OppfolgingStatus> =>
    fetchToJson(fnr, `${OPPFOLGING_BASE_URL}/oppfolging`);

export const fetchMal = (fnr: string | undefined): Promise<Mal> =>
    fetchToJson(fnr, `${OPPFOLGING_BASE_URL}/oppfolging/mal`);

export const fetchMalListe = (fnr: string | undefined): Promise<Mal[]> =>
    fetchToJson(fnr, `${OPPFOLGING_BASE_URL}/oppfolging/malListe`);

export const lagreMal = (mal: any, fnr: string | undefined): Promise<Mal> =>
    postAsJson(fnr, `${OPPFOLGING_BASE_URL}/oppfolging/mal`, mal);

export const fetchHarFlereAktorId = (fnr: string | undefined): Promise<boolean> =>
    fetchToJson(fnr, `${OPPFOLGING_BASE_URL}/oppfolging/harFlereAktorIderMedOppfolging`);

// Bare veileder
export const doLesAktivitetsplan = (fnr: string) => {
    return postAsJson(fnr, `${OPPFOLGING_BASE_URL}/${fnr}/lestaktivitetsplan`);
};
