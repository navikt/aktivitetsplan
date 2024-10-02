import { ArenaAktivitet } from '../datatypes/arenaAktivitetTypes';
import { Forhaandsorientering } from '../datatypes/forhaandsorienteringTypes';
import { MoteAktivitet, SamtalereferatAktivitet, VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { AKTIVITET_BASE_URL } from '../environment';
import { fetchToJson, postAsJson, putAsJson } from './utils';
import { hentFraSessionStorage, LocalStorageElement } from '../mocks/demo/localStorage';

export const hentAktivitet = (aktivitetId: string): Promise<VeilarbAktivitet> =>
    fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitetId}`);

export const hentAktiviteter = (): Promise<{ aktiviteter: VeilarbAktivitet[] }> =>
    fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet`);

export const lagNyAktivitet = (aktivitet: VeilarbAktivitet, oppfolgingsperiodeId: string): Promise<VeilarbAktivitet> =>
    postAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${oppfolgingsperiodeId}/ny`, aktivitet);

export const oppdaterAktivitet = (aktivitet: VeilarbAktivitet): Promise<VeilarbAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}`, aktivitet);

export const hentInnsynsrett = (): Promise<{ foresatteHarInnsynsrett: boolean }> => {
    return postAsJson(`${AKTIVITET_BASE_URL}/innsynsrett`, { fnr: hentFraSessionStorage(LocalStorageElement.FNR) });
};

export const settAktivitetTilAvtalt = (
    aktivitetId: string,
    aktivitetVersjon: string,
    forhaandsorientering: Forhaandsorientering,
) =>
    putAsJson(`${AKTIVITET_BASE_URL}/avtaltMedNav?aktivitetId=${aktivitetId}`, {
        aktivitetVersjon,
        forhaandsorientering,
    });

export const markerForhaandsorienteringSomLest = (
    aktivitetId: string,
    aktivitetVersjon: string,
): Promise<VeilarbAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/avtaltMedNav/lest`, {
        aktivitetId,
        aktivitetVersion: aktivitetVersjon,
    });

export const oppdaterCvKanDelesSvar = (
    aktivitetId: string,
    aktivitetVersjon: string,
    kanDeles: boolean,
    avtaltDato?: string,
): Promise<VeilarbAktivitet> => {
    return putAsJson(`${AKTIVITET_BASE_URL}/stillingFraNav/kanDeleCV?aktivitetId=${aktivitetId}`, {
        aktivitetVersjon,
        kanDeles,
        avtaltDato,
    });
};

export const oppdaterAktivitetStatus = (aktivitet: VeilarbAktivitet): Promise<VeilarbAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/status`, aktivitet);

export const oppdaterAktivitetEtikett = (aktivitet: VeilarbAktivitet): Promise<VeilarbAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/etikett`, aktivitet);

export const publiserReferat = (
    aktivitet: SamtalereferatAktivitet | MoteAktivitet,
): Promise<SamtalereferatAktivitet | MoteAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/referat/publiser`, aktivitet);

export const oppdaterReferat = (
    aktivitet: SamtalereferatAktivitet | MoteAktivitet,
): Promise<SamtalereferatAktivitet | MoteAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/referat`, aktivitet);

export const hentVersjonerTilAktivitet = (aktivitet: VeilarbAktivitet): Promise<VeilarbAktivitet[]> =>
    fetchToJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/versjoner`);

export const oppdaterStillingFraNavSoknadsstatus = (
    aktivitetId: string,
    aktivitetVersjon: string,
    soknadsstatus: string,
): Promise<VeilarbAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/stillingFraNav/soknadStatus?aktivitetId=${aktivitetId}`, {
        aktivitetVersjon,
        soknadsstatus,
    });

export const hentArenaAktiviteter = (): Promise<ArenaAktivitet[]> =>
    postAsJson(`${AKTIVITET_BASE_URL}/arena/tiltak`, { fnr: hentFraSessionStorage(LocalStorageElement.FNR) });

export const sendForhaandsorienteringArenaAktivitet = ({
    arenaaktivitetId,
    oppfolgingsPeriodeId,
    forhaandsorientering,
}: {
    arenaaktivitetId: string;
    oppfolgingsPeriodeId: string;
    forhaandsorientering: Forhaandsorientering;
}): Promise<ArenaAktivitet> =>
    putAsJson(
        `${AKTIVITET_BASE_URL}/arena/${oppfolgingsPeriodeId}/forhaandsorientering?arenaaktivitetId=${arenaaktivitetId}`,
        forhaandsorientering,
    );

export const markerForhaandsorienteringSomLestArenaAktivitet = (aktivitetId: string): Promise<ArenaAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/arena/forhaandsorientering/lest?aktivitetId=${aktivitetId}`);

export const journalfoerAktivitetsplanOgDialog = (
    oppfolgingsperiodeId: string,
    forhaandsvisningOpprettet: string,
    journalførendeEnhet: string,
) =>
    postAsJson(`${AKTIVITET_BASE_URL}/arkivering/journalfor?oppfolgingsperiodeId=${oppfolgingsperiodeId}`, {
        forhaandsvisningOpprettet,
        journalforendeEnhet: journalførendeEnhet,
    });
export const genererPdfTilForhaandsvisning = (oppfolgingsperiodeId: string, journalførendeEnhet: string) =>
    fetchToJson(
        `${AKTIVITET_BASE_URL}/arkivering/forhaandsvisning?oppfolgingsperiodeId=${oppfolgingsperiodeId}&journalforendeEnhet=${journalførendeEnhet}`,
    );
