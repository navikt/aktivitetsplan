import { Mal, Me, OppfolgingStatus } from '../datatypes/oppfolgingTypes';
import { OPPFOLGING_BASE_URL } from '../environment';
import { fetchToJson, postAsJson } from './utils';

// OK, denne trenger ikke fnr
export const fetchIdentitet = (): Promise<Me> => fetchToJson(`${OPPFOLGING_BASE_URL}/api/v3/oppfolging/me`);

// Ikke synlid for veileder
export const settDigital = (fnr: string | undefined): Promise<OppfolgingStatus> =>
    postAsJson(`${OPPFOLGING_BASE_URL}/api/v3/oppfolging/settDigital`, fnr ? { fnr } : undefined);

export const fetchOppfolging = (fnr: string | undefined): Promise<OppfolgingStatus> =>
    postAsJson(`${OPPFOLGING_BASE_URL}/api/v3/oppfolging/hent-status`, fnr ? { fnr } : undefined);

export const fetchMal = (fnr: string | undefined): Promise<Mal> =>
    postAsJson(`${OPPFOLGING_BASE_URL}/api/v3/hent-maal`, fnr ? { fnr } : undefined);

export const fetchMalListe = (fnr: string | undefined): Promise<Mal[]> =>
    postAsJson(`${OPPFOLGING_BASE_URL}/api/v3/maal/hent-alle`, fnr ? { fnr } : undefined);

interface LagreMal {
    maal: string;
}
export const lagreMal = (mal: string, fnr: string | undefined): Promise<Mal> =>
    postAsJson(`${OPPFOLGING_BASE_URL}/api/v3/maal`, { maalInnhold: { maal: mal }, fnr });

export const fetchHarFlereAktorId = (fnr: string | undefined): Promise<boolean> =>
    postAsJson(`${OPPFOLGING_BASE_URL}/api/v3/oppfolging/harFlereAktorIderMedOppfolging`, fnr ? { fnr } : undefined);

export const doLesAktivitetsplan = (fnr: string) => {
    return postAsJson(`${OPPFOLGING_BASE_URL}/${fnr}/lestaktivitetsplan`);
};
