import me from './me';
import oppfolging from './oppfolging';
import dialog, {
    setVenterPaSvar,
    setFerdigBehandlet,
    opprettDialog,
} from './dialog';
import arbeidsliste from './arbeidsliste';
import aktiviteter, {
    getAktivitet,
    getAktivitetVersjoner,
    opprettAktivitet,
    oppdaterAktivitet,
} from './aktivitet';
import arena from './arena';
import getPerson from './person';
import { malListe, opprettMal, sisteMal } from './mal';
import vilkar from './vilkar';
import veilederTilgang from './veilederTilgang';
import veiledere from './veiledere';
import enheter from './enheter';
import feature from './feature';
import fetchMock from 'yet-another-fetch-mock';
import { fetchmockMiddleware } from './utils';

const mock = fetchMock.configure({
    enableFallback: false,
    middleware: fetchmockMiddleware,
});

//feature-api
mock.get('/feature', feature);

//veilarboppfolging-api
mock.get('/veilarboppfolging/api/oppfolging/me', me);

mock.get('/veilarboppfolging/api/oppfolging/mal', () => sisteMal());
mock.post('/veilarboppfolging/api/oppfolging/mal', ({ body }) =>
    opprettMal(body)
);

mock.get('/veilarboppfolging/api/oppfolging/malListe', () => malListe());
mock.get('/veilarboppfolging/api/oppfolging', ({ queryParams }) =>
    oppfolging(queryParams)
);

mock.get('/veilarboppfolging/api/oppfolging/hentVilkaarStatusListe', vilkar);

mock.get('/veilarboppfolging/api/oppfolging/innstillingsHistorikk', []);
mock.get('/veilarboppfolging/api/oppfolging/veilederTilgang', veilederTilgang);

//veilarboppfolgingproxy
mock.get('/veilarboppfolgingproxy/api/oppfolging/me', me);
mock.get('/veilarboppfolgingproxy/api/oppfolging', ({ queryParams }) =>
    oppfolging(queryParams)
);

//veilarboppgave-api
mock.get('/veilarboppgave/api/oppgavehistorikk', []);

//veilarbportefolje-api
mock.get('/veilarbportefolje/api/arbeidsliste/:fnr', arbeidsliste);

//veilarbdialog-api
mock.get('/veilarbdialog/api/dialog', dialog);
mock.put(
    '/veilarbdialog/api/dialog/:dialogId/venter_pa_svar/:bool',
    ({ pathParams }) => setVenterPaSvar(pathParams.dialogId, pathParams.bool)
);
mock.put(
    '/veilarbdialog/api/dialog/:dialogId/ferdigbehandlet/:bool',
    ({ pathParams }) => setFerdigBehandlet(pathParams.dialogId, pathParams.bool)
);
mock.post('/veilarbdialog/api/dialog', ({ body }) => opprettDialog(body));

//veilarbdialogproxy
mock.get('/veilarbdialogproxy/api/dialog', dialog);


// veilarbaktivitet-api
mock.get('/veilarbaktivitet/api/aktivitet/kanaler', [
    'internett',
    'oppmote',
    'telefon',
]);
mock.get('/veilarbaktivitet/api/aktivitet/arena', arena);
mock.get('/veilarbaktivitet/api/aktivitet/:aktivitetId', ({ pathParams }) =>
    getAktivitet(pathParams.aktivitetId)
);
mock.get('/veilarbaktivitet/api/aktivitet', aktiviteter);

mock.post('/veilarbaktivitet/api/aktivitet/ny', ({ body }) =>
    opprettAktivitet(body)
);
mock.get(
    '/veilarbaktivitet/api/aktivitet/:aktivitetId/versjoner',
    ({ pathParams }) => getAktivitetVersjoner(pathParams.aktivitetId)
);
mock.put(
    '/veilarbaktivitet/api/aktivitet/:aktivitetId',
    ({ pathParams, body }) => oppdaterAktivitet(pathParams.aktivitetId, body)
);
mock.put(
    '/veilarbaktivitet/api/aktivitet/:aktivitetId/status',
    ({ pathParams, body }) => oppdaterAktivitet(pathParams.aktivitetId, body)
);
mock.put(
    '/veilarbaktivitet/api/aktivitet/:aktivitetId/etikett',
    ({ pathParams, body }) => oppdaterAktivitet(pathParams.aktivitetId, body)
);

//veilarbaktivitetproxy
mock.get('/veilarbaktivitetproxy/api/aktivitet/arena', arena);
mock.get('/veilarbaktivitetproxy/api/aktivitet/:aktivitetId', ({ pathParams }) =>
    getAktivitet(pathParams.aktivitetId)
);
mock.get('/veilarbaktivitetproxy/api/aktivitet', aktiviteter);


//veilarbperson-api
mock.get('/veilarbperson/api/person/:fnr', ({ pathParams }) =>
    getPerson(pathParams.fnr)
);

//veilarbveileder-api
mock.get(
    '/veilarbveileder/api/enhet/:enhetNr/veiledere',
    ({ pathParams }) => veiledere
);

//veilarboppgave-api
mock.get('/veilarboppgave/api/enheter', ({ queryParams }) => enheter);

mock.post('/veilarboppfolging/api/tilordneveileder', ({ body }) => {
    return {
        feilendeTilordninger: [],
        resultat: 'OK: Veiledere tilordnet',
    };
});
