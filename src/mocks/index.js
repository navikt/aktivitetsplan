/* eslint-disable */

import fetchMock from 'yet-another-fetch-mock';

import {
    aktiviteterData,
    getAktivitet,
    getAktivitetVersjoner,
    oppdaterAktivitet,
    oppdaterAvtaltMedNav,
    opprettAktivitet,
    publiserReferat,
} from './aktivitet';
import { arena, oppdaterArenaaktivitet } from './arena';
import { auth } from './auth';
import {
    aktivitetFeilet,
    arenaFeilet,
    dialogFeilet,
    maalFeilet,
    nivaa4Feilet,
    oppdateringKunFeiler,
    oppfFeilet,
} from './demo/sessionstorage';
import dialog, { opprettDialog, setFerdigBehandlet, setVenterPaSvar } from './dialog';
import { failOrGetResponse } from './failOrGetResponse';
import getFeatures from './features';
import { innstillingsHistorikk } from './innstillings-historikk';
import { lest } from './lest';
import { malListe, opprettMal, sisteMal } from './mal';
import { hentMalverkMedType } from './malverk';
import { me } from './me';
import { oppfoelgingsstatus } from './oppfoelgingsstatus';
import getOppfolging, { avslutningStatus, settDigital, startEskalering, stoppEskalering } from './oppfolging';
import getPerson from './person';
import getNivaa4 from './tilgang';
import { fetchmockMiddleware, jsonResponse } from './utils';
import { veilederTilgang } from './veilederTilgang';

const mock = fetchMock.configure({
    enableFallback: false,
    middleware: fetchmockMiddleware,
});

const getOppfFeiler = () => oppfFeilet() && !oppdateringKunFeiler();
const getMaalFeiler = () => maalFeilet() && !oppdateringKunFeiler();
const getAktivitetFeiler = () => aktivitetFeilet() && !oppdateringKunFeiler();

mock.get('/veilarboppfolging/api/oppfolging/harFlereAktorIderMedOppfolging', jsonResponse(true));

//feature-api
mock.get('/aktivitetsplan/api/feature', ({ queryParams }, res, ctx) => res(ctx.json(getFeatures(queryParams))));
mock.get('/api/feature', ({ queryParams }, res, ctx) => res(ctx.json(getFeatures(queryParams))));

//veilarboppfolging-api

mock.get('/veilarboppfolging/api/oppfolging/me', failOrGetResponse(getOppfFeiler, me));

mock.get('/veilarboppfolging/api/oppfolging/mal', failOrGetResponse(getMaalFeiler, sisteMal));
mock.post('/veilarboppfolging/api/oppfolging/mal', failOrGetResponse(maalFeilet, opprettMal));

mock.get('/veilarboppfolging/api/oppfolging/malListe', failOrGetResponse(getMaalFeiler, malListe));

mock.get('/veilarboppfolging/api/oppfolging', failOrGetResponse(getOppfFeiler, getOppfolging));

mock.get(
    '/veilarboppfolging/api/oppfolging/innstillingsHistorikk',
    failOrGetResponse(getOppfFeiler, () => innstillingsHistorikk)
);
mock.get('/veilarboppfolging/api/oppfolging/veilederTilgang', jsonResponse(veilederTilgang));
mock.get('/veilarboppfolging/api/oppfolging/avslutningStatus', ({ body }, res, ctx) =>
    res(ctx.json(avslutningStatus(body)))
);
mock.post('/veilarboppfolging/api/oppfolging/startEskalering', ({ body }, res, ctx) =>
    res(ctx.json(startEskalering(body)))
);

mock.post('/veilarboppfolging/api/oppfolging/stoppEskalering', ({ body }, res, ctx) =>
    res(ctx.json(stoppEskalering(body)))
);
mock.post('/veilarboppfolging/api/:fnr/lestaktivitetsplan', (_, res, ctx) => res(ctx.status(200)));

mock.post('/veilarboppfolging/api/oppfolging/settDigital', failOrGetResponse(oppfFeilet, settDigital));

mock.get(
    '/veilarboppfolging/api/person/:fnr/oppfoelgingsstatus',
    failOrGetResponse(oppfFeilet, () => oppfoelgingsstatus)
);

//veilarboppgave-api
mock.get('/veilarboppgave/api/oppgavehistorikk', jsonResponse([]));

//veilarbdialog-api
mock.get(
    '/veilarbdialog/api/dialog',
    failOrGetResponse(dialogFeilet, () => dialog)
);

mock.get('/veilarbdialog/api/dialog/sistOppdatert', jsonResponse({ sistOppdatert: '2020-06-25T12:58:12.757+02:00' }));

mock.put('/veilarbdialog/api/dialog/:dialogId/venter_pa_svar/:bool', ({ pathParams }, res, ctx) =>
    res(ctx.json(setVenterPaSvar(pathParams.dialogId, pathParams.bool)))
);
mock.put('/veilarbdialog/api/dialog/:dialogId/ferdigbehandlet/:bool', ({ pathParams }, res, ctx) =>
    res(ctx.json(setFerdigBehandlet(pathParams.dialogId, pathParams.bool)))
);
mock.post('/veilarbdialog/api/dialog', ({ body }, res, ctx) => res(ctx.json(opprettDialog(body))));
mock.post('/veilarbdialog/api/dialog/forhandsorientering', ({ body }, res, ctx) => res(ctx.json(opprettDialog(body))));

// veilarbaktivitet-api

mock.get(
    '/veilarbaktivitet/api/aktivitet/kanaler',
    failOrGetResponse(getAktivitetFeiler, () => ['INTERNETT', 'OPPMOTE', 'TELEFON'])
);
mock.get(
    '/veilarbaktivitet/api/arena/tiltak',
    failOrGetResponse(
        () => arenaFeilet() && !oppdateringKunFeiler(),
        () => arena
    )
);

mock.put(
    '/veilarbaktivitet/api/arena/forhaandsorientering',
    failOrGetResponse(() => arenaFeilet() && !oppdateringKunFeiler(), oppdaterArenaaktivitet)
);

mock.get('/veilarbaktivitet/api/aktivitet/:aktivitetId', failOrGetResponse(getAktivitetFeiler, getAktivitet));

mock.get(
    '/veilarbaktivitet/api/aktivitet',
    failOrGetResponse(getAktivitetFeiler, () => aktiviteterData)
);

mock.post('/veilarbaktivitet/api/aktivitet/ny', failOrGetResponse(aktivitetFeilet, opprettAktivitet));

mock.get(
    '/veilarbaktivitet/api/aktivitet/:aktivitetId/versjoner',
    failOrGetResponse(getAktivitetFeiler, getAktivitetVersjoner)
);

mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId', failOrGetResponse(aktivitetFeilet, oppdaterAktivitet));

mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/status', failOrGetResponse(aktivitetFeilet, oppdaterAktivitet));

mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/etikett', failOrGetResponse(aktivitetFeilet, oppdaterAktivitet));

mock.put(
    '/veilarbaktivitet/api/aktivitet/:aktivitetId/referat/publiser',
    failOrGetResponse(aktivitetFeilet, publiserReferat)
);

mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/referat', failOrGetResponse(aktivitetFeilet, oppdaterAktivitet));

mock.put('/veilarbaktivitet/api/avtaltMedNav', failOrGetResponse(aktivitetFeilet, oppdaterAvtaltMedNav));

//veilarbperson-api
mock.get('/veilarbperson/api/person/:fnr', ({ pathParams }, res, ctx) => res(ctx.json(getPerson(pathParams.fnr))));
mock.get('/veilarbperson/api/person/:fnr/harNivaa4', failOrGetResponse(nivaa4Feilet, getNivaa4));

//veilarbmalverk-api
mock.post('/veilarbmalverk/api/mal', ({ body }, res, ctx) => res(ctx.json(hentMalverkMedType(body))));

//aktivitetsplan-api
mock.get('/api/auth', jsonResponse(auth));

///veilarblest/api
mock.get('/veilarblest/api/aktivitetsplan/les', (req, res, ctx) => res(ctx.json(lest)));
mock.put('/veilarblest/api/informasjon/les', ({ queryParams }, res, ctx) => res(ctx.json(lest)));
