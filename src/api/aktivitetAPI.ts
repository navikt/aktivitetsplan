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

export const oppdaterAktivitetStatus = (aktivitet: Aktivitet): Promise<Aktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/status`, aktivitet);

export const oppdaterAktivitetEtikett = (aktivitet: Aktivitet): Promise<Aktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/etikett`, aktivitet);

export const publiserReferat = (aktivitet: Aktivitet): Promise<Aktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/referat/publiser`, aktivitet);

export const oppdaterReferat = (aktivitet: Aktivitet): Promise<Aktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/referat`, aktivitet);

export const hentArenaAktiviteter = (): Promise<ArenaAktivitet[]> =>
    fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet/arena`);

export const hentVersjonerTilAktivitet = (aktivitet: Aktivitet): Promise<Aktivitet> =>
    fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/versjoner`);

export const sendForhaandsorienteringArenaAktivitet = (
    arenaaktivitetId: string,
    forhaandsorientering: Forhaandsorientering
): Promise<ArenaAktivitet> =>
    putAsJson(
        `${AKTIVITET_BASE_URL}/arena/forhaandsorientering?arenaaktivitetId=${arenaaktivitetId}`,
        forhaandsorientering
    );
