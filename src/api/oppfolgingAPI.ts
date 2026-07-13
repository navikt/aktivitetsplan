import { Mal, Me, OppfolgingStatus } from '../datatypes/oppfolgingTypes';
import { OPPFOLGING_BASE_URL } from '../environment';
import { fetchToJson, postAsJson } from './utils';

// OK, denne trenger ikke fnr
export const fetchIdentitet = (): Promise<Me> =>
    fetchToJson(`${OPPFOLGING_BASE_URL}/v3/oppfolging/me`, {}, 'fetchIdentitet');

// Ikke synlid for veileder
export const settDigital = (fnr: string | undefined): Promise<void> =>
    postAsJson(`${OPPFOLGING_BASE_URL}/v3/oppfolging/settDigital`, fnr ? { fnr } : undefined, 'settDigital');

export const fetchMal = (fnr: string | undefined): Promise<Mal> =>
    postAsJson(`${OPPFOLGING_BASE_URL}/v3/hent-maal`, fnr ? { fnr } : undefined, 'fetchMal');

export const fetchMalListe = (fnr: string | undefined): Promise<Mal[]> =>
    postAsJson(`${OPPFOLGING_BASE_URL}/v3/maal/hent-alle`, fnr ? { fnr } : undefined, 'fetchMalListe');

export const lagreMal = (mal: string, fnr: string | undefined): Promise<Mal> =>
    postAsJson(`${OPPFOLGING_BASE_URL}/v3/maal`, { maalInnhold: { maal: mal }, fnr }, 'lagreMal');

export const doLesAktivitetsplan = (fnr: string) => {
    return postAsJson(`${OPPFOLGING_BASE_URL}/v3/veileder/lest-aktivitetsplan`, { fnr }, 'doLesAktivitetsplan');
};
