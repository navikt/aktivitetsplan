import { ArenaAktivitet } from '../datatypes/arenaAktivitetTypes';
import { Forhaandsorientering } from '../datatypes/forhaandsorienteringTypes';
import { MoteAktivitet, SamtalereferatAktivitet, VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { AKTIVITET_BASE_URL } from '../environment';
import { postAsJson, putAsJson } from './utils';
import { hentFraSessionStorage, LocalStorageElement } from '../mocks/demo/localStorage';
import { ArkivFilter } from '../moduler/verktoylinje/arkivering/arkiv-slice';

export const lagNyAktivitet = (aktivitet: VeilarbAktivitet, oppfolgingsperiodeId: string): Promise<VeilarbAktivitet> =>
    postAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${oppfolgingsperiodeId}/ny`, aktivitet, 'Opprett aktivitet');

export const oppdaterAktivitet = (aktivitet: VeilarbAktivitet): Promise<VeilarbAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}`, aktivitet, 'Oppdater aktivitet');

export const hentInnsynsrett = (): Promise<{ foresatteHarInnsynsrett: boolean }> => {
    return postAsJson(
        `${AKTIVITET_BASE_URL}/innsynsrett`,
        { fnr: hentFraSessionStorage(LocalStorageElement.FNR) },
        'Hent innsynsrett',
    );
};

export const settAktivitetTilAvtalt = (
    aktivitetId: string,
    aktivitetVersjon: string,
    forhaandsorientering: Forhaandsorientering,
) =>
    putAsJson(
        `${AKTIVITET_BASE_URL}/avtaltMedNav?aktivitetId=${aktivitetId}`,
        {
            aktivitetVersjon,
            forhaandsorientering,
        },
        'Sett aktivitet til avtalt',
    );

export const markerForhaandsorienteringSomLest = (
    aktivitetId: string,
    aktivitetVersjon: string,
): Promise<VeilarbAktivitet> =>
    putAsJson(
        `${AKTIVITET_BASE_URL}/avtaltMedNav/lest`,
        {
            aktivitetId,
            aktivitetVersion: aktivitetVersjon,
        },
        'Marker forhaandsorientering som lest',
    );

export const oppdaterCvKanDelesSvar = (
    aktivitetId: string,
    aktivitetVersjon: string,
    kanDeles: boolean,
    avtaltDato?: string,
): Promise<VeilarbAktivitet> => {
    return putAsJson(
        `${AKTIVITET_BASE_URL}/stillingFraNav/kanDeleCV?aktivitetId=${aktivitetId}`,
        {
            aktivitetVersjon,
            kanDeles,
            avtaltDato,
        },
        'Oppdater Cv–Kan-Deles Svar',
    );
};

export const oppdaterAktivitetStatus = (aktivitet: VeilarbAktivitet): Promise<VeilarbAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/status`, aktivitet, 'Oppdater aktivitet status');

export const oppdaterAktivitetEtikett = (aktivitet: VeilarbAktivitet): Promise<VeilarbAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/etikett`, aktivitet, 'Oppdater aktivitet etikett');

export const publiserReferat = (
    aktivitet: SamtalereferatAktivitet | MoteAktivitet,
): Promise<SamtalereferatAktivitet | MoteAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/referat/publiser`, aktivitet, 'Publiser referat');

export const oppdaterReferat = (
    aktivitet: SamtalereferatAktivitet | MoteAktivitet,
): Promise<SamtalereferatAktivitet | MoteAktivitet> =>
    putAsJson(`${AKTIVITET_BASE_URL}/aktivitet/${aktivitet.id}/referat`, aktivitet, 'Oppdater referat');

export const oppdaterStillingFraNavSoknadsstatus = (
    aktivitetId: string,
    aktivitetVersjon: string,
    soknadsstatus: string,
): Promise<VeilarbAktivitet> =>
    putAsJson(
        `${AKTIVITET_BASE_URL}/stillingFraNav/soknadStatus?aktivitetId=${aktivitetId}`,
        {
            aktivitetVersjon,
            soknadsstatus,
        },
        'Oppdater Stilling-Fra-Nav soknadsstatus',
    );

export const hentArenaAktiviteter = (): Promise<ArenaAktivitet[]> =>
    postAsJson(
        `${AKTIVITET_BASE_URL}/arena/tiltak`,
        { fnr: hentFraSessionStorage(LocalStorageElement.FNR) },
        'Hent arena aktiviteter',
    );

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
        'Send forhaandsorientering for Arena-aktivitet',
    );

export const markerForhaandsorienteringSomLestArenaAktivitet = (aktivitetId: string): Promise<ArenaAktivitet> =>
    putAsJson(
        `${AKTIVITET_BASE_URL}/arena/forhaandsorientering/lest?aktivitetId=${aktivitetId}`,
        {},
        'Marker forhaandsorientering som lest Arena-aktivitet',
    );

export const journalfoerAktivitetsplanOgDialog = (
    oppfolgingsperiodeId: string,
    forhaandsvisningOpprettet: string,
    journalførendeEnhetId: string,
    uuidCachetPdf: string,
) =>
    postAsJson(
        `${AKTIVITET_BASE_URL}/arkivering/journalfor?oppfolgingsperiodeId=${oppfolgingsperiodeId}`,
        {
            forhaandsvisningOpprettet,
            journalførendeEnhetId,
            uuidCachetPdf,
        },
        'Journalfoer aktivitetsplan og dialog',
    );

export const genererPdfTilForhaandsvisning = (oppfolgingsperiodeId: string, journalførendeEnhetId: string) =>
    postAsJson(
        `${AKTIVITET_BASE_URL}/arkivering/forhaandsvisning?oppfolgingsperiodeId=${oppfolgingsperiodeId}`,
        {
            journalførendeEnhetId,
        },
        'Generer pdf til forhaandsvisning',
    );

export const journalforOgSendTilBruker = (
    oppfolgingsperiodeId: string,
    forhaandsvisningOpprettet: string,
    journalførendeEnhetId: string,
    filter: ArkivFilter,
    uuidCachetPdf: string | undefined,
    tekstTilBruker?: string,
) =>
    postAsJson(
        `${AKTIVITET_BASE_URL}/arkivering/send-til-bruker?oppfolgingsperiodeId=${oppfolgingsperiodeId}`,
        {
            forhaandsvisningOpprettet,
            journalførendeEnhetId,
            filter,
            uuidCachetPdf,
            tekstTilBruker,
        },
        'Journalfor og send til bruker',
    );

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
        'Generer pdf til forhaandsvisning - send til bruker',
    );
