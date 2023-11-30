import { ArenaAktivitet } from '../datatypes/arenaAktivitetTypes';
import { Forhaandsorientering } from '../datatypes/forhaandsorienteringTypes';
import { MoteAktivitet, SamtalereferatAktivitet, VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { AKTIVITET_BASE_URL } from '../environment';
import { fetchToJson, postAsJson, putAsJson } from './utils';

export const hentAktivitet = (aktivitetId: string, fnr: string | undefined): Promise<VeilarbAktivitet> =>
    fetchToJson(fnr, `${AKTIVITET_BASE_URL}/aktivitet/${aktivitetId}`);

export const lagNyAktivitet = (aktivitet: VeilarbAktivitet, fnr: string | undefined): Promise<VeilarbAktivitet> =>
    postAsJson(fnr, `${AKTIVITET_BASE_URL}/aktivitet/ny`, aktivitet);

export const oppdaterAktivitet = (aktivitet: VeilarbAktivitet, fnr: string | undefined): Promise<VeilarbAktivitet> =>
    putAsJson(fnr, `${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}`, aktivitet);

export const settAktivitetTilAvtalt = (
    aktivitetId: string,
    aktivitetVersjon: string,
    forhaandsorientering: Forhaandsorientering,
    fnr: string | undefined,
) =>
    putAsJson(fnr, `${AKTIVITET_BASE_URL}/avtaltMedNav?aktivitetId=${aktivitetId}`, {
        aktivitetVersjon,
        forhaandsorientering,
    });

export const markerForhaandsorienteringSomLest = (
    aktivitetId: string,
    aktivitetVersjon: string,
    fnr: string | undefined,
): Promise<VeilarbAktivitet> =>
    putAsJson(fnr, `${AKTIVITET_BASE_URL}/avtaltMedNav/lest`, {
        aktivitetId,
        aktivitetVersion: aktivitetVersjon,
    });

export interface OppdaterCVKanDelesPayload {
    aktivitetId: string;
    aktivitetVersjon: string;
    kanDeles: boolean;
    avtaltDato: string;
}
export const oppdaterCvKanDelesSvar = (
    fnr: string | undefined,
    { aktivitetVersjon, kanDeles, avtaltDato, aktivitetId }: OppdaterCVKanDelesPayload,
): Promise<VeilarbAktivitet> => {
    return putAsJson(fnr, `${AKTIVITET_BASE_URL}/stillingFraNav/kanDeleCV?aktivitetId=${aktivitetId}`, {
        aktivitetVersjon,
        kanDeles,
        avtaltDato,
    });
};

export const oppdaterAktivitetStatus = (
    aktivitet: VeilarbAktivitet,
    fnr: string | undefined,
): Promise<VeilarbAktivitet> => putAsJson(fnr, `${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/status`, aktivitet);

export const oppdaterAktivitetEtikett = (
    aktivitet: VeilarbAktivitet,
    fnr: string | undefined,
): Promise<VeilarbAktivitet> => putAsJson(fnr, `${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/etikett`, aktivitet);

export const publiserReferat = (
    aktivitet: SamtalereferatAktivitet | MoteAktivitet,
    fnr: string | undefined,
): Promise<SamtalereferatAktivitet | MoteAktivitet> =>
    putAsJson(fnr, `${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/referat/publiser`, aktivitet);

export const oppdaterReferat = (
    aktivitet: SamtalereferatAktivitet | MoteAktivitet,
    fnr: string | undefined,
): Promise<SamtalereferatAktivitet | MoteAktivitet> =>
    putAsJson(fnr, `${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/referat`, aktivitet);

export const hentVersjonerTilAktivitet = (
    aktivitet: VeilarbAktivitet,
    fnr: string | undefined,
): Promise<VeilarbAktivitet[]> => fetchToJson(fnr, `${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/versjoner`);

export const oppdaterStillingFraNavSoknadsstatus = (
    aktivitetId: string,
    aktivitetVersjon: string,
    soknadsstatus: string,
    fnr: string | undefined,
): Promise<VeilarbAktivitet> =>
    putAsJson(fnr, `${AKTIVITET_BASE_URL}/stillingFraNav/soknadStatus?aktivitetId=${aktivitetId}`, {
        aktivitetVersjon,
        soknadsstatus,
    });

export const hentArenaAktiviteter = (fnr: string | undefined): Promise<ArenaAktivitet[]> =>
    fetchToJson(fnr, `${AKTIVITET_BASE_URL}/arena/tiltak`);

export const sendForhaandsorienteringArenaAktivitet = (
    arenaaktivitetId: string,
    forhaandsorientering: Forhaandsorientering,
    fnr: string | undefined,
): Promise<ArenaAktivitet> =>
    putAsJson(
        fnr,
        `${AKTIVITET_BASE_URL}/arena/forhaandsorientering?arenaaktivitetId=${arenaaktivitetId}`,
        forhaandsorientering,
    );

export const markerForhaandsorienteringSomLestArenaAktivitet = (
    aktivitetId: string,
    fnr: string | undefined,
): Promise<ArenaAktivitet> =>
    putAsJson(undefined, `${AKTIVITET_BASE_URL}/arena/forhaandsorientering/lest?aktivitetId=${aktivitetId}`);
