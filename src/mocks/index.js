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
import fetchMock, { ResponseUtils } from 'yet-another-fetch-mock';
import { fetchmockMiddleware } from './utils';
import { hentMalverkMedType } from './malverk';
import auth from './auth';
import lest from './lest';
import { oppfFeilet } from './demo/sessionstorage';

const mock = fetchMock.configure({
    enableFallback: false,
    middleware: fetchmockMiddleware,
});

const noContent = ResponseUtils.statusCode(204);
const unauthorized = ResponseUtils.combine(
    ResponseUtils.statusCode(401),
    ResponseUtils.json({
        id: '1170c6534ed5eca272d527cd30c6a455',
        type: 'UKJENT',
        detaljer: {
            detaljertType: 'javax.ws.rs.Unauthorized',
            feilMelding: 'HTTP 401 Unauthorized',
            stackTrace: 'javax.ws.rs.Unauthorized:HTTP 401 Unauthorized\r\n\t',
        },
    })
);
const internalServerError = ResponseUtils.combine(
    ResponseUtils.statusCode(500),
    ResponseUtils.json({
        id: '9170c6534ed5eca272d527cd30c6a458',
        type: 'UKJENT',
        detaljer: {
            detaljertType: 'javax.ws.rs.InternalServerErrorException',
            feilMelding: 'HTTP 500 Internal Server Error',
            stackTrace: 'javax.ws.rs.InternalServerErrorException: HTTP 500 Internal Server Error\r\n\t',
        },
    })
);

//feature-api
mock.get('/aktivitetsplan/api/feature', ({ queryParams }) => getFeatures(queryParams));
mock.get('/api/feature', ({ queryParams }) => getFeatures(queryParams));

//veilarboppfolging-api
mock.get('/veilarboppfolging/api/oppfolging/me', me);

mock.get('/veilarboppfolging/api/oppfolging/mal', () => sisteMal());
mock.post('/veilarboppfolging/api/oppfolging/mal', ({ body }) => opprettMal(body, true));

mock.get('/veilarbvedtakinfo/api/fremtidigsituasjon', ResponseUtils.delayed(500, fremtidigSituasjon));

mock.get('/veilarboppfolging/api/oppfolging/malListe', () => malListe());

mock.get(
    '/veilarboppfolging/api/oppfolging',
    oppfFeilet() ? internalServerError : ({ queryParams }) => oppfolging(queryParams)
);

mock.get('/veilarboppfolging/api/oppfolging/innstillingsHistorikk', instillingsHistorikk);
mock.get('/veilarboppfolging/api/oppfolging/veilederTilgang', veilederTilgang);
mock.get('/veilarboppfolging/api/oppfolging/avslutningStatus', ({ body }) => avslutningStatus(body));
mock.post('/veilarboppfolging/api/oppfolging/startEskalering', ({ body }) => startEskalering(body));
mock.post('/veilarboppfolging/api/oppfolging/settDigital', ({ body }) => settDigital(body));

mock.post('/veilarboppfolging/api/oppfolging/stoppEskalering', ({ body }) => stoppEskalering(body));
mock.post('/veilarboppfolging/api/:fnr/lestaktivitetsplan', () => ResponseUtils.statusCode(200));
mock.post('/veilarboppfolging/api/oppfolging/settManuell', ({ queryParams }) =>
    oppfolging(queryParams, (res) => {
        res.manuell = true;
        return res;
    })
);

//veilarboppgave-api
mock.get('/veilarboppgave/api/oppgavehistorikk', []);

//veilarbdialog-api
mock.get('/veilarbdialog/api/dialog', dialog);

mock.put('/veilarbdialog/api/dialog/:dialogId/venter_pa_svar/:bool', ({ pathParams }) =>
    setVenterPaSvar(pathParams.dialogId, pathParams.bool)
);
mock.put('/veilarbdialog/api/dialog/:dialogId/ferdigbehandlet/:bool', ({ pathParams }) =>
    setFerdigBehandlet(pathParams.dialogId, pathParams.bool)
);
mock.post('/veilarbdialog/api/dialog', ({ body }) => opprettDialog(body));
mock.post('/veilarbdialog/api/dialog/forhandsorientering', ({ body }) => opprettDialog(body));

// veilarbaktivitet-api
mock.get('/veilarbaktivitet/api/aktivitet/kanaler', ['INTERNETT', 'OPPMOTE', 'TELEFON']);
mock.get('/veilarbaktivitet/api/aktivitet/arena', arena);
mock.get('/veilarbaktivitet/api/aktivitet/:aktivitetId', ({ pathParams }) => getAktivitet(pathParams.aktivitetId));
mock.get('/veilarbaktivitet/api/aktivitet', aktiviteter);

mock.post('/veilarbaktivitet/api/aktivitet/ny', ({ body }) => opprettAktivitet(body));
mock.get('/veilarbaktivitet/api/aktivitet/:aktivitetId/versjoner', ({ pathParams }) =>
    getAktivitetVersjoner(pathParams.aktivitetId)
);
mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId', ({ pathParams, body }) =>
    oppdaterAktivitet(pathParams.aktivitetId, body)
);
mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/status', ({ pathParams, body }) =>
    oppdaterAktivitet(pathParams.aktivitetId, body)
);
mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/etikett', ({ pathParams, body }) =>
    oppdaterAktivitet(pathParams.aktivitetId, body)
);
mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/referat/publiser', ({ pathParams }) =>
    publiserReferat(pathParams.aktivitetId)
);
mock.put('/veilarbaktivitet/api/aktivitet/:aktivitetId/referat', ({ pathParams, body }) =>
    oppdaterAktivitet(pathParams.aktivitetId, body)
);

//veilarbperson-api
mock.get('/veilarbperson/api/person/:fnr', ({ pathParams }) => getPerson(pathParams.fnr));

mock.get('/veilarboppfolging/api/person/:fnr/oppfoelgingsstatus', oppfoelgingsstatus);

//veilarbmalverk-api
mock.post('/veilarbmalverk/api/mal', ({ body }) => hentMalverkMedType(body));

//aktivitetsplan-api
mock.get('/api/auth', auth);

///veilarblest/api
mock.get('/veilarblest/api/aktivitetsplan/les', () => lest);
mock.put('/veilarblest/api/informasjon/les', ({ queryParams }) => lest);
