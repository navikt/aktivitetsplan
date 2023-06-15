import { rest } from 'msw';

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
import dialog, { opprettDialog, setFerdigBehandlet, setVenterPaaSvar } from './data/dialog';
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
import getNivaa4 from './data/tilgang';
import { veilederMe } from './data/Veileder';
import { veilederTilgang } from './data/veilederTilgang';
import {
    aktivitetFeilet,
    arenaFeilet,
    dialogFeilet,
    maalFeilet,
    nivaa4Feilet,
    oppdateringKunFeiler,
    oppfFeilet,
} from './demo/sessionstorage';
import { failOrGetResponse, jsonResponse } from './utils';

const getOppfFeiler = () => oppfFeilet() && !oppdateringKunFeiler();
const getMaalFeiler = () => maalFeilet() && !oppdateringKunFeiler();
const getAktivitetFeiler = () => aktivitetFeilet() && !oppdateringKunFeiler();

export const handlers = [
    rest.get('/auth/info', jsonResponse(auth)),

    // veilarboppfolging
    rest.get('/veilarboppfolging/api/oppfolging/me', failOrGetResponse(getOppfFeiler, me)),
    rest.get('/veilarboppfolging/api/oppfolging', failOrGetResponse(getOppfFeiler, getOppfolging)),
    rest.get('/veilarboppfolging/api/oppfolging/harFlereAktorIderMedOppfolging', jsonResponse(true)),
    rest.get('/veilarboppfolging/api/oppfolging/mal', failOrGetResponse(getMaalFeiler, sisteMal)),
    rest.get('/veilarboppfolging/api/oppfolging/malListe', failOrGetResponse(getMaalFeiler, malListe)),
    rest.get('/veilarboppfolging/api/oppfolging/veilederTilgang', jsonResponse(veilederTilgang)),
    rest.get('/veilarboppfolging/api/oppfolging/avslutningStatus', jsonResponse(avslutningStatus)),
    rest.get(
        '/veilarboppfolging/api/oppfolging/innstillingsHistorikk',
        failOrGetResponse(getOppfFeiler, () => innstillingsHistorikk)
    ),
    rest.get(
        '/veilarboppfolging/api/person/:fnr/oppfoelgingsstatus',
        failOrGetResponse(oppfFeilet, () => oppfoelgingsstatus)
    ),
    rest.post('/veilarboppfolging/api/oppfolging/mal', failOrGetResponse(maalFeilet, opprettMal)),
    rest.post('/veilarboppfolging/api/:fnr/lestaktivitetsplan', (_, res, ctx) => res(ctx.status(204))),
    rest.post('/veilarboppfolging/api/oppfolging/settDigital', failOrGetResponse(oppfFeilet, settDigital)),

    // veilarbdialog
    rest.get(
        '/veilarbdialog/api/dialog',
        failOrGetResponse(dialogFeilet, () => dialog)
    ),
    rest.get('/veilarbdialog/api/eskaleringsvarsel/gjeldende', jsonResponse(eskaleringsvarsel)),
    rest.get('/veilarbdialog/api/dialog/sistOppdatert', jsonResponse({ sistOppdatert: 1678793406845 })),
    rest.put('/veilarbdialog/api/dialog/:dialogId/venter_pa_svar/:bool', jsonResponse(setVenterPaaSvar)),
    rest.put('/veilarbdialog/api/dialog/:dialogId/ferdigbehandlet/:bool', jsonResponse(setFerdigBehandlet)),
    rest.post('/veilarbdialog/api/dialog', jsonResponse(opprettDialog)),

    // veilarbaktivitet
    rest.post('/veilarbaktivitet/api/logger/event', (_, res, ctx) => res(ctx.status(200))),
    rest.get(
        '/veilarbaktivitet/api/aktivitet',
        failOrGetResponse(getAktivitetFeiler, () => aktiviteterData)
    ),
    rest.get(
        '/veilarbaktivitet/api/arena/tiltak',
        failOrGetResponse(
            () => arenaFeilet() && !oppdateringKunFeiler(),
            () => arena
        )
    ),
    rest.get(
        '/veilarbaktivitet/api/aktivitet/kanaler',
        failOrGetResponse(getAktivitetFeiler, () => ['INTERNETT', 'OPPMOTE', 'TELEFON'])
    ),
    rest.put(
        '/veilarbaktivitet/api/arena/forhaandsorientering',
        failOrGetResponse(() => arenaFeilet() && !oppdateringKunFeiler(), oppdaterArenaaktivitet)
    ),
    rest.put(
        '/veilarbaktivitet/api/arena/forhaandsorientering/lest',
        failOrGetResponse(() => arenaFeilet() && !oppdateringKunFeiler(), oppdaterLestFhoArenaaktivitet)
    ),
    rest.get('/veilarbaktivitet/api/aktivitet/:aktivitetId', failOrGetResponse(getAktivitetFeiler, getAktivitet)),
    rest.put('/veilarbaktivitet/api/aktivitet/:aktivitetId', failOrGetResponse(aktivitetFeilet, oppdaterAktivitet)),
    rest.post('/veilarbaktivitet/api/aktivitet/ny', failOrGetResponse(aktivitetFeilet, opprettAktivitet)),
    rest.get(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/versjoner',
        failOrGetResponse(getAktivitetFeiler, getAktivitetVersjoner)
    ),
    rest.put(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/status',
        failOrGetResponse(aktivitetFeilet, oppdaterAktivitetStatus)
    ),
    // todo sjekk ut denne, tror ikke det kun er stillingsaktivitet
    rest.put(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/etikett',
        failOrGetResponse(aktivitetFeilet, oppdaterEtikett)
    ),
    rest.put(
        '/veilarbaktivitet/api/aktivitet/:aktivitetId/referat/publiser',
        failOrGetResponse(aktivitetFeilet, publiserReferat)
    ),
    rest.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/referat', failOrGetResponse(aktivitetFeilet, endreReferat)),
    rest.put('/veilarbaktivitet/api/avtaltMedNav', failOrGetResponse(aktivitetFeilet, oppdaterAvtaltMedNav)),
    rest.put('/veilarbaktivitet/api/avtaltMedNav/lest', failOrGetResponse(aktivitetFeilet, oppdaterLestFho)),
    rest.put(
        '/veilarbaktivitet/api/stillingFraNav/kanDeleCV',
        failOrGetResponse(aktivitetFeilet, oppdaterCVKanDelesSvar)
    ),
    rest.put(
        '/veilarbaktivitet/api/stillingFraNav/soknadStatus',
        failOrGetResponse(aktivitetFeilet, oppdaterStillingFraNavSoknadsstatus)
    ),

    // veilarblest
    rest.get('/veilarblest/api/aktivitetsplan/les', jsonResponse(lest)),
    rest.put('/veilarblest/api/informasjon/les', jsonResponse(lest)),

    // veilarbperson
    rest.get('/veilarbperson/api/v2/person', jsonResponse(getPerson)),
    rest.get('/veilarbperson/api/v2/person/postadresse', jsonResponse(getPostadresse)),
    rest.get('/veilarbperson/api/person/:fnr/harNivaa4', failOrGetResponse(nivaa4Feilet, getNivaa4)),

    // veilarbveileder
    rest.get('/veilarbveileder/api/veileder/me', jsonResponse(veilederMe)),

    // veilarboppgave
    rest.get('/veilarboppgave/api/oppgavehistorikk', jsonResponse([])),

    // veilarbmalverk
    rest.post('/veilarbmalverk/api/mal', jsonResponse(hentMalverkMedType)),

    // veilarbpersonflatefs
    rest.get('/veilarbpersonflatefs/api/feature', jsonResponse(features)),
];
