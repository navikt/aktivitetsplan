import { mock, delayed, respondWith, randomFailure } from './utils';
import tekster from './tekster';
import me from './me';
import oppfolging from './oppfolging';
import dialog from './dialog';
import arbeidsliste from './arbeidsliste';
import aktivitet from './aktivitet';
import arena from './arena';


mock.get('express:/veilarbaktivitetsplanfs/api/tekster*', respondWith(tekster));
mock.get('express:/veilarboppfolging/api/oppfolging/me?fnr=:fnr', respondWith(me));
mock.get('express:/veilarboppfolging/api/oppfolging?fnr=:fnr',
    respondWith((url, config, {queryParams, bodyParams, extra}) => oppfolging(queryParams)));

mock.get('express:/veilarbdialog/api/dialog?fnr=:fnr', respondWith(dialog));
mock.get('express:/veilarbportefolje/api/arbeidsliste/:fnr?fnr=:fnr', respondWith(arbeidsliste));
mock.get('express:/veilarbaktivitet/api/aktivitet?fnr=:fnr', respondWith(aktivitet));
mock.get('express:/veilarbaktivitet/api/aktivitet/arena?fnr=:fnr', respondWith(arena));
