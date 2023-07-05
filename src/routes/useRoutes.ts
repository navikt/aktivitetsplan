import { useFnr } from '../Provider';
import {
    aktivitetRoute,
    avbrytAktivitetRoute,
    endreAktivitetRoute,
    fullforAktivitetRoute,
    hovedsideRoute,
    informasjonRoute,
    malRoute,
    nyAktivitetRoute,
} from './routes';

export const useRoutes = () => {
    const fnr = useFnr();
    return {
        aktivitetRoute: (aktivitetId: string) => aktivitetRoute(aktivitetId, fnr),
        nyAktivitetRoute: () => nyAktivitetRoute(fnr),
        endreAktivitetRoute: (aktivitetId: string) => endreAktivitetRoute(aktivitetId, fnr),
        fullforAktivitetRoute: (aktivitetId: string) => fullforAktivitetRoute(aktivitetId, fnr),
        avbrytAktivitetRoute: (aktivitetId: string) => avbrytAktivitetRoute(aktivitetId, fnr),
        hovedsideRoute: () => hovedsideRoute(fnr),
        malRoute: () => malRoute(fnr),
        informasjonRoute: () => informasjonRoute(fnr),
    };
};
