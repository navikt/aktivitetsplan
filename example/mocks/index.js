import { mock, delayed, respondWith, randomFailure } from './utils';
import tekster from './tekster';
import me from './me';
import oppfolging from './oppfolging';
import dialog from './dialog';
import arbeidsliste from './arbeidsliste';
import aktiviteter, {
    getAktivitet,
    opprettAktivitet,
    oppdaterAktivitet,
} from './aktivitet';
import arena from './arena';

mock.get('/veilarbaktivitetsplanfs/api/tekster', respondWith(tekster));
mock.get('/veilarboppfolging/api/oppfolging/me', respondWith(me));
mock.get(
    '/veilarboppfolging/api/oppfolging',
    respondWith(({ queryParams }) => oppfolging(queryParams))
);

mock.get('/veilarbdialog/api/dialog', respondWith(dialog));
mock.get('/veilarbportefolje/api/arbeidsliste/:fnr', respondWith(arbeidsliste));

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
