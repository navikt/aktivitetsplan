import { Aktivitet, ArenaAktivitet, Forhaandsorientering } from '../datatypes/aktivitetTypes';
import { AKTIVITET_BASE_URL } from '../environment';
import { fetchToJson, postAsJson, putAsJson } from './utils';

export const hentAktivitet = (aktivitetId: string): Promise<Aktivitet> =>
    fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitetId}`);

export const hentAktiviteter = (): Promise<Aktivitet[]> => fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet`);

export const lagNyAktivitet = (aktivitet: Aktivitet): Promise<Aktivitet> =>
    postAsJson(`${AKTIVITET_BASE_URL}/aktivitet/ny`, aktivitet);

export const oppdaterAktivitet = (aktivitet: Aktivitet): Promise<Aktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}`, aktivitet);

export const settAktivitetTilAvtalt = (
    aktivitetId: string,
    aktivitetVersjon: string,
    forhaandsorientering: Forhaandsorientering
) =>
    putAsJson(`${AKTIVITET_BASE_URL}/avtaltMedNav?aktivitetId=${aktivitetId}`, {
        aktivitetVersjon,
        forhaandsorientering,
    });

export const markerForhaandsorienteringSomLest = (aktivitetId: string, aktivitetVersjon: string): Promise<Aktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/avtaltMedNav/lest`, {
        aktivitetId,
        aktivitetVersion: aktivitetVersjon,
    });

export const oppdaterCvKanDelesSvar = (
    aktivitetId: string,
    aktivitetVersjon: string,
    kanDeles: boolean,
    avtaltDato?: string
): Promise<Aktivitet> => {
    return putAsJson(`${AKTIVITET_BASE_URL}/stillingFraNav/kanDeleCV?aktivitetId=${aktivitetId}`, {
        aktivitetVersjon,
        kanDeles,
        avtaltDato,
    });
};

export const oppdaterAktivitetStatus = (aktivitet: Aktivitet): Promise<Aktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/status`, aktivitet);

export const oppdaterAktivitetEtikett = (aktivitet: Aktivitet): Promise<Aktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/etikett`, aktivitet);

export const publiserReferat = (aktivitet: Aktivitet): Promise<Aktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/referat/publiser`, aktivitet);

export const oppdaterReferat = (aktivitet: Aktivitet): Promise<Aktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/referat`, aktivitet);

export const hentVersjonerTilAktivitet = (aktivitet: Aktivitet): Promise<Aktivitet> =>
    fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/versjoner`);

export const oppdaterStillingFraNavSoknadsstatus = (
    aktivitetId: string,
    aktivitetVersjon: string,
    soknadsstatus: string
): Promise<Aktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/stillingFraNav/soknadStatus?aktivitetId=${aktivitetId}`, {
        aktivitetVersjon,
        soknadsstatus,
    });

export const hentArenaAktiviteter = (): Promise<ArenaAktivitet[]> => fetchToJson(`${AKTIVITET_BASE_URL}/arena/tiltak`);

export const sendForhaandsorienteringArenaAktivitet = (
    arenaaktivitetId: string,
    forhaandsorientering: Forhaandsorientering
): Promise<ArenaAktivitet> =>
    putAsJson(
        `${AKTIVITET_BASE_URL}/arena/forhaandsorientering?arenaaktivitetId=${arenaaktivitetId}`,
        forhaandsorientering
    );

export const markerForhaandsorienteringSomLestArenaAktivitet = (aktivitetId: string): Promise<ArenaAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/arena/forhaandsorientering/lest?aktivitetId=${aktivitetId}`);
