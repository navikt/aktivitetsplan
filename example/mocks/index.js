import { mock, delayed, respondWith, randomFailure } from './utils';
import tekster from './tekster';
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
    opprettAktivitet,
    oppdaterAktivitet,
} from './aktivitet';
import arena from './arena';
import getPerson from './person';

mock.get('/veilarbaktivitetsplanfs/api/tekster', respondWith(tekster));
mock.get('/veilarboppfolging/api/oppfolging/me', respondWith(me));
mock.get(
    '/veilarboppfolging/api/oppfolging',
    respondWith(({ queryParams }) => oppfolging(queryParams))
);

mock.get('/veilarbportefolje/api/arbeidsliste/:fnr', respondWith(arbeidsliste));

//veilarbdialog-api
mock.get('/veilarbdialog/api/dialog', respondWith(dialog));
mock.put(
    '/veilarbdialog/api/dialog/:dialogId/venter_pa_svar/:bool',
    respondWith(({ pathParams }) =>
        setVenterPaSvar(pathParams.dialogId, pathParams.bool)
    )
);
mock.put(
    '/veilarbdialog/api/dialog/:dialogId/ferdigbehandlet/:bool',
    respondWith(({ pathParams }) =>
        setFerdigBehandlet(pathParams.dialogId, pathParams.bool)
    )
);
mock.post(
    '/veilarbdialog/api/dialog',
    respondWith(({ body }) => opprettDialog(body))
);

// veilarbaktivitet-api
mock.get('/veilarbaktivitet/api/aktivitet/arena', respondWith(arena));
mock.get(
    '/veilarbaktivitet/api/aktivitet/:aktivitetId',
    respondWith(({ pathParams }) => getAktivitet(pathParams.aktivitetId))
);
mock.get('/veilarbaktivitet/api/aktivitet', respondWith(aktiviteter));

mock.post(
    '/veilarbaktivitet/api/aktivitet/ny',
    respondWith(({ body }) => opprettAktivitet(body))
);
mock.get(
    '/veilarbaktivitet/api/aktivitet/:aktivitetId/versjoner',
    respondWith(({ pathParams }) => {
        const aktivitet = getAktivitet(pathParams.aktivitetId);
        return [
            aktivitet,
            {
                ...aktivitet,
                endretDato: '2017-02-26T15:51:44.85+01:00',
                versjon: '2',
                lagtInnAv: 'BRUKER',
                transaksjonsType: 'OPPRETTET',
            },
        ];
    })
);
mock.put(
    '/veilarbaktivitet/api/aktivitet/:aktivitetId',
    respondWith(({ pathParams, body }) =>
        oppdaterAktivitet(pathParams.aktivitetId, body)
    )
);
mock.put(
    '/veilarbaktivitet/api/aktivitet/:aktivitetId/status',
    respondWith(({ pathParams, body }) =>
        oppdaterAktivitet(pathParams.aktivitetId, body)
    )
);
mock.put(
    '/veilarbaktivitet/api/aktivitet/:aktivitetId/etikett',
    respondWith(({ pathParams, body }) =>
        oppdaterAktivitet(pathParams.aktivitetId, body)
    )
);

//veilarbperson-api
mock.get(
    '/veilarbperson/api/person/:fnr',
    respondWith(({ pathParams }) => getPerson(pathParams.fnr))
);
