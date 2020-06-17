/* eslint-disable */

import me from './me';
import oppfolging, { avslutningStatus, settDigital, startEskalering, stoppEskalering } from './oppfolging';
import dialog, { opprettDialog, setFerdigBehandlet, setVenterPaSvar } from './dialog';
import aktiviteter, {
    getAktivitet,
    getAktivitetVersjoner,
    oppdaterAktivitet,
    opprettAktivitet,
    publiserReferat,
} from './aktivitet';
import arena from './arena';
import getPerson from './person';
import { malListe, opprettMal, sisteMal } from './mal';
import { fremtidigSituasjon } from './fremtidigSituasjon';
import veilederTilgang from './veilederTilgang';
import getFeatures from './features';
import oppfoelgingsstatus from './oppfoelgingsstatus';
import instillingsHistorikk from './innstillings-historikk';
import fetchMock from 'yet-another-fetch-mock';
import { delayed, fetchmockMiddleware, jsonResponse } from './utils';
import { hentMalverkMedType } from './malverk';
import auth from './auth';
import lest from './lest';
import { oppfFeilet } from './demo/sessionstorage';

const mock = fetchMock.configure({
    enableFallback: false,
    middleware: fetchmockMiddleware,
});

const noContent = (ctx) => ctx.status(204);
const unauthorized = (ctx) => [
    ctx.status(401),
    ctx.json({
        id: '1170c6534ed5eca272d527cd30c6a455',
        type: 'UKJENT',
        detaljer: {
            detaljertType: 'javax.ws.rs.Unauthorized',
            feilMelding: 'HTTP 401 Unauthorized',
            stackTrace: 'javax.ws.rs.Unauthorized:HTTP 401 Unauthorized\r\n\t',
        },
    }),
];
const internalServerError = (ctx) => [
    ctx.status(500),
    ctx.json({
        id: '9170c6534ed5eca272d527cd30c6a458',
        type: 'UKJENT',
        detaljer: {
            detaljertType: 'javax.ws.rs.InternalServerErrorException',
            feilMelding: 'HTTP 500 Internal Server Error',
            stackTrace: 'javax.ws.rs.InternalServerErrorException: HTTP 500 Internal Server Error\r\n\t',
        },
    }),
];

//feature-api
mock.get('/aktivitetsplan/api/feature', ({ queryParams }, res, ctx) => res(ctx.json(getFeatures(queryParams))));
mock.get('/api/feature', ({ queryParams }, res, ctx) => res(ctx.json(getFeatures(queryParams))));

//veilarboppfolging-api
mock.get('/veilarboppfolging/api/oppfolging/me', jsonResponse(me()));

mock.get('/veilarboppfolging/api/oppfolging/mal', jsonResponse(sisteMal()));
mock.post('/veilarboppfolging/api/oppfolging/mal', ({ body }, res, ctx) => res(ctx.json(opprettMal(body, true))));

mock.get('/veilarbvedtakinfo/api/fremtidigsituasjon', delayed(500, jsonResponse(fremtidigSituasjon)));

mock.get('/veilarboppfolging/api/oppfolging/malListe', jsonResponse(malListe()));

mock.get('/veilarboppfolging/api/oppfolging', (req, res, ctx) => {
    const result = oppfFeilet() ? internalServerError(ctx) : ctx.json(oppfolging(req.queryParams));
    return res(result);
});

mock.get('/veilarboppfolging/api/oppfolging/innstillingsHistorikk', jsonResponse(instillingsHistorikk));
mock.get('/veilarboppfolging/api/oppfolging/veilederTilgang', jsonResponse(veilederTilgang));
mock.get('/veilarboppfolging/api/oppfolging/avslutningStatus', ({ body }, res, ctx) =>
    res(ctx.json(avslutningStatus(body)))
);
mock.post('/veilarboppfolging/api/oppfolging/startEskalering', ({ body }, res, ctx) =>
    res(ctx.json(startEskalering(body)))
);
mock.post('/veilarboppfolging/api/oppfolging/settDigital', ({ body }, res, ctx) => res(ctx.json(settDigital(body))));

mock.post('/veilarboppfolging/api/oppfolging/stoppEskalering', ({ body }, res, ctx) =>
    res(ctx.json(stoppEskalering(body)))
);
mock.post('/veilarboppfolging/api/:fnr/lestaktivitetsplan', (_, res, ctx) => res(ctx.status(200)));
mock.post('/veilarboppfolging/api/oppfolging/settManuell', ({ queryParams }, res, ctx) =>
    res(
        ctx.json(
            oppfolging(queryParams, (res) => {
                res.manuell = true;
                return res;
            })
        )
    )
);

//veilarboppgave-api
mock.get('/veilarboppgave/api/oppgavehistorikk', jsonResponse([]));

//veilarbdialog-api
mock.get('/veilarbdialog/api/dialog', jsonResponse(dialog));

mock.put('/veilarbdialog/api/dialog/:dialogId/venter_pa_svar/:bool', ({ pathParams }, res, ctx) =>
    res(ctx.json(setVenterPaSvar(pathParams.dialogId, pathParams.bool)))
);
mock.put('/veilarbdialog/api/dialog/:dialogId/ferdigbehandlet/:bool', ({ pathParams }, res, ctx) =>
    res(ctx.json(setFerdigBehandlet(pathParams.dialogId, pathParams.bool)))
);
mock.post('/veilarbdialog/api/dialog', ({ body }, res, ctx) => res(ctx.json(opprettDialog(body))));
mock.post('/veilarbdialog/api/dialog/forhandsorientering', ({ body }, res, ctx) => res(ctx.json(opprettDialog(body))));

// veilarbaktivitet-api
mock.get('/veilarbaktivitet/api/aktivitet/kanaler', jsonResponse(['INTERNETT', 'OPPMOTE', 'TELEFON']));
mock.get('/veilarbaktivitet/api/aktivitet/arena', jsonResponse(arena));
mock.get('/veilarbaktivitet/api/aktivitet/:aktivitetId', ({ pathParams }, res, ctx) =>
    res(ctx.json(getAktivitet(pathParams.aktivitetId)))
);
mock.get('/veilarbaktivitet/api/aktivitet', jsonResponse(aktiviteter));

mock.post('/veilarbaktivitet/api/aktivitet/ny', ({ body }, res, ctx) => res(ctx.json(opprettAktivitet(body))));
mock.get('/veilarbaktivitet/api/aktivitet/:aktivitetId/versjoner', ({ pathParams }, res, ctx) =>
    res(ctx.json(getAktivitetVersjoner(pathParams.aktivitetId)))
);
mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId', ({ pathParams, body }, res, ctx) =>
    res(ctx.json(oppdaterAktivitet(pathParams.aktivitetId, body)))
);
mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/status', ({ pathParams, body }, res, ctx) =>
    res(ctx.json(oppdaterAktivitet(pathParams.aktivitetId, body)))
);
mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/etikett', ({ pathParams, body }, res, ctx) =>
    res(ctx.json(oppdaterAktivitet(pathParams.aktivitetId, body)))
);
mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/referat/publiser', ({ pathParams }, res, ctx) =>
    res(ctx.json(publiserReferat(pathParams.aktivitetId)))
);
mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/referat', ({ pathParams, body }, res, ctx) =>
    res(ctx.json(oppdaterAktivitet(pathParams.aktivitetId, body)))
);

//veilarbperson-api
mock.get('/veilarbperson/api/person/:fnr', ({ pathParams }, res, ctx) => res(ctx.json(getPerson(pathParams.fnr))));

mock.get('/veilarboppfolging/api/person/:fnr/oppfoelgingsstatus', jsonResponse(oppfoelgingsstatus));

//veilarbmalverk-api
mock.post('/veilarbmalverk/api/mal', ({ body }, res, ctx) => res(ctx.json(hentMalverkMedType(body))));

//aktivitetsplan-api
mock.get('/api/auth', jsonResponse(auth));

///veilarblest/api
mock.get('/veilarblest/api/aktivitetsplan/les', (req, res, ctx) => res(ctx.json(lest)));
mock.put('/veilarblest/api/informasjon/les', ({ queryParams }, res, ctx) => res(ctx.json(lest)));
