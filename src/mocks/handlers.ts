import { http } from 'msw';

import {
    aktiviteterData,
    endreReferat,
    getAktivitet,
    getAktivitetVersjoner,
    oppdaterAktivitet,
    oppdaterAktivitetStatus,
    oppdaterAvtaltMedNav,
    oppdaterCVKanDelesSvar,
    oppdaterEtikett,
    oppdaterLestFho,
    oppdaterStillingFraNavSoknadsstatus,
    opprettAktivitet,
    publiserReferat,
} from './aktivitet';
import { arena, oppdaterArenaaktivitet, oppdaterLestFhoArenaaktivitet } from './data/arena';
import { auth } from './data/auth';
import dialog from './data/dialog';
import { eskaleringsvarsel } from './data/eskaleringsvarsel';
import { features } from './data/feature';
import { innstillingsHistorikk } from './data/innstillings-historikk';
import { lest } from './data/lest';
import { malListe, opprettMal, sisteMal } from './data/mal';
import { hentMalverkMedType } from './data/malverk';
import { me } from './data/me';
import { oppfoelgingsstatus } from './data/oppfoelgingsstatus';
import getOppfolging, { avslutningStatus, settDigital } from './data/oppfolging';
import { getPerson, getPostadresse } from './data/person';
import { veilederMe } from './data/Veileder';
import { veilederTilgang } from './data/veilederTilgang';
import pdfForhaandsvisning from './fixtures/pdfForhaandsvisning.json';
import {
    aktivitetFeilet,
    arenaFeilet,
    dialogFeilet,
    forhaandsvisningFeiler,
    journalforingFeiler,
    maalFeilet,
    oppdateringKunFeiler,
    oppfFeilet,
} from './demo/localStorage';
import { failOrGetResponse, failOrGrahpqlResponse, jsonResponse } from './utils';
import { VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { journalføring } from './data/journalføring';

const getOppfFeiler = () => oppfFeilet() && !oppdateringKunFeiler();
const getMaalFeiler = () => maalFeilet() && !oppdateringKunFeiler();
const getAktivitetFeiler = () => aktivitetFeilet() && !oppdateringKunFeiler();
const resolveAktiviteter = () => aktiviteterData;
export const handlers = [
    http.get('/auth/info', jsonResponse(auth)),

    // veilarboppfolging
    http.get('/veilarboppfolging/api/oppfolging/me', failOrGetResponse(getOppfFeiler, me)),
    http.get('/veilarboppfolging/api/oppfolging', failOrGetResponse(getOppfFeiler, getOppfolging)),
    http.get('/veilarboppfolging/api/oppfolging/harFlereAktorIderMedOppfolging', jsonResponse(true)),
    http.get('/veilarboppfolging/api/oppfolging/mal', failOrGetResponse(getMaalFeiler, sisteMal)),
    http.get('/veilarboppfolging/api/oppfolging/malListe', failOrGetResponse(getMaalFeiler, malListe)),
    http.get('/veilarboppfolging/api/oppfolging/veilederTilgang', jsonResponse(veilederTilgang)),
    http.get('/veilarboppfolging/api/oppfolging/avslutningStatus', jsonResponse(avslutningStatus)),
    http.get(
        '/veilarboppfolging/api/oppfolging/innstillingsHistorikk',
        failOrGetResponse(getOppfFeiler, () => innstillingsHistorikk),
    ),
    http.get(
        '/veilarboppfolging/api/person/:fnr/oppfoelgingsstatus',
        failOrGetResponse(oppfFeilet, () => oppfoelgingsstatus),
    ),
    http.post('/veilarboppfolging/api/oppfolging/mal', failOrGetResponse(maalFeilet, opprettMal)),
    http.post('/veilarboppfolging/api/:fnr/lestaktivitetsplan', () => new Response(null, { status: 204 })),
    http.post('/veilarboppfolging/api/oppfolging/settDigital', failOrGetResponse(oppfFeilet, settDigital)),

    // veilarbdialog
    http.get(
        '/veilarbdialog/api/dialog',
        failOrGetResponse(dialogFeilet, () => dialog),
    ),
    http.get('/veilarbdialog/api/eskaleringsvarsel/gjeldende', jsonResponse(eskaleringsvarsel)),
    http.get('/veilarbdialog/api/dialog/sistOppdatert', jsonResponse({ sistOppdatert: 1678793406845 })),

    // veilarbaktivitet
    http.post('/veilarbaktivitet/api/logger/event', () => new Response()),
    http.get('/veilarbaktivitet/api/aktivitet', failOrGetResponse(getAktivitetFeiler, resolveAktiviteter)),
    http.post(
        '/veilarbaktivitet/graphql',
        failOrGrahpqlResponse(getAktivitetFeiler, (noe) => {
            return aktivitestplanResponse(); // Default aktiviteter
        }),
    ),
    http.post(
        '/veilarbaktivitet/api/arena/tiltak',
        failOrGetResponse(
            () => arenaFeilet() && !oppdateringKunFeiler(),
            () => arena,
        ),
    ),
    http.get(
        '/veilarbaktivitet/api/aktivitet/kanaler',
        failOrGetResponse(getAktivitetFeiler, () => ['INTERNETT', 'OPPMOTE', 'TELEFON']),
    ),
    http.put(
        '/veilarbaktivitet/api/arena/forhaandsorientering',
        failOrGetResponse(() => arenaFeilet() && !oppdateringKunFeiler(), oppdaterArenaaktivitet),
    ),
    http.put(
        '/veilarbaktivitet/api/arena/forhaandsorientering/lest',
        failOrGetResponse(() => arenaFeilet() && !oppdateringKunFeiler(), oppdaterLestFhoArenaaktivitet),
    ),
    http.get('/veilarbaktivitet/api/aktivitet/:aktivitetId', failOrGetResponse(getAktivitetFeiler, getAktivitet)),
    http.put('/veilarbaktivitet/api/aktivitet/:aktivitetId', failOrGetResponse(aktivitetFeilet, oppdaterAktivitet)),
    http.post('/veilarbaktivitet/api/aktivitet/ny', failOrGetResponse(aktivitetFeilet, opprettAktivitet)),
    http.get(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/versjoner',
        failOrGetResponse(getAktivitetFeiler, getAktivitetVersjoner),
    ),
    http.put(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/status',
        failOrGetResponse(aktivitetFeilet, oppdaterAktivitetStatus),
    ),
    // todo sjekk ut denne, tror ikke det kun er stillingsaktivitet
    http.put(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/etikett',
        failOrGetResponse(aktivitetFeilet, oppdaterEtikett),
    ),
    http.put(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/referat/publiser',
        failOrGetResponse(aktivitetFeilet, publiserReferat),
    ),
    http.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/referat', failOrGetResponse(aktivitetFeilet, endreReferat)),
    http.put('/veilarbaktivitet/api/avtaltMedNav', failOrGetResponse(aktivitetFeilet, oppdaterAvtaltMedNav)),
    http.put('/veilarbaktivitet/api/avtaltMedNav/lest', failOrGetResponse(aktivitetFeilet, oppdaterLestFho)),
    http.put(
        '/veilarbaktivitet/api/stillingFraNav/kanDeleCV',
        failOrGetResponse(aktivitetFeilet, oppdaterCVKanDelesSvar),
    ),
    http.put(
        '/veilarbaktivitet/api/stillingFraNav/soknadStatus',
        failOrGetResponse(aktivitetFeilet, oppdaterStillingFraNavSoknadsstatus),
    ),
    http.get('/veilarbaktivitet/api/feature', jsonResponse(features)),
    http.get(
        '/veilarbaktivitet/api/arkivering/forhaandsvisning',
        failOrGetResponse(forhaandsvisningFeiler, () => pdfForhaandsvisning, 500),
    ),
    http.post(
        '/veilarbaktivitet/api/arkivering/journalfor',
        failOrGetResponse(journalforingFeiler, () => journalføring, 2000),
    ),

    // veilarblest
    http.get('/veilarblest/api/aktivitetsplan/les', jsonResponse(lest)),
    http.put('/veilarblest/api/informasjon/les', jsonResponse(lest)),

    // veilarbperson
    http.get('/veilarbperson/api/v2/person', jsonResponse(getPerson)),
    http.get('/veilarbperson/api/v2/person/postadresse', jsonResponse(getPostadresse)),

    // veilarbveileder
    http.get('/veilarbveileder/api/veileder/me', jsonResponse(veilederMe)),

    // veilarboppgave
    http.get('/veilarboppgave/api/oppgavehistorikk', jsonResponse([])),

    // veilarbmalverk
    http.post('/veilarbmalverk/api/mal', jsonResponse(hentMalverkMedType)),
];

export const aktivitestplanResponse = (
    { aktiviteter }: { aktiviteter: VeilarbAktivitet[] } = { aktiviteter: aktiviteterData.aktiviteter },
) => {
    const perioder = Array.from(new Set(aktiviteter.map((aktivitet) => aktivitet.oppfolgingsperiodeId)));
    return {
        data: {
            perioder: perioder.map((periodeId) => ({
                id: periodeId,
                aktiviteter: aktiviteter.filter((aktivitet) => aktivitet.oppfolgingsperiodeId === periodeId),
            })),
        },
    };
};
