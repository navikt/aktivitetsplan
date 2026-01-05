import { ArenaAktivitet } from '../datatypes/arenaAktivitetTypes';
import { Forhaandsorientering } from '../datatypes/forhaandsorienteringTypes';
import { MoteAktivitet, SamtalereferatAktivitet, VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { AKTIVITET_BASE_URL } from '../environment';
import { postAsJson, putAsJson } from './utils';
import { hentFraSessionStorage, LocalStorageElement } from '../mocks/demo/localStorage';
import { ArkivFilter } from '../moduler/verktoylinje/arkivering/arkiv-slice';

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
    journalførendeEnhetId: string,
) =>
    postAsJson(`${AKTIVITET_BASE_URL}/arkivering/journalfor?oppfolgingsperiodeId=${oppfolgingsperiodeId}`, {
        forhaandsvisningOpprettet,
        journalførendeEnhetId,
    });
export const genererPdfTilForhaandsvisning = (oppfolgingsperiodeId: string, journalførendeEnhetId: string) =>
    postAsJson(`${AKTIVITET_BASE_URL}/arkivering/forhaandsvisning?oppfolgingsperiodeId=${oppfolgingsperiodeId}`, {
        journalførendeEnhetId,
    });

export const genererPdfTilForhaandsvisningSendTilBruker = (
    oppfolgingsperiodeId: string,
    filter: ArkivFilter,
    journalførendeEnhetId: string,
    tekstTilBruker: string,
) =>
    postAsJson(
        `${AKTIVITET_BASE_URL}/arkivering/forhaandsvisning-send-til-bruker?oppfolgingsperiodeId=${oppfolgingsperiodeId}`,
        {
            filter,
            journalførendeEnhetId,
            tekstTilBruker,
        },
    );

export const journalforOgSendTilBruker = (
    oppfolgingsperiodeId: string,
    forhaandsvisningOpprettet: string,
    journalførendeEnhetId: string,
    filter: ArkivFilter,
    tekstTilBruker?: string,
) =>
    postAsJson(`${AKTIVITET_BASE_URL}/arkivering/send-til-bruker?oppfolgingsperiodeId=${oppfolgingsperiodeId}`, {
        forhaandsvisningOpprettet,
        journalførendeEnhetId,
        filter,
        tekstTilBruker,
    });
