import { useFnr } from './Provider';

const fnrPath = (fnr?: string) => (fnr ? `/${fnr}` : '');
const aktivitetRoute = (aktivitetId: string, fnr?: string) => fnrPath(fnr) + `/aktivitet/vis/${aktivitetId}`;
const nyAktivitetRoute = (fnr?: string) => `${fnrPath(fnr)}/aktivitet/ny`;
const endreAktivitetRoute = (aktivitetId: string, fnr?: string) => fnrPath(fnr) + `/aktivitet/endre/${aktivitetId}`;
const fullforAktivitetRoute = (aktivitetId: string, fnr?: string) => fnrPath(fnr) + `/aktivitet/fullfor/${aktivitetId}`;
const avbrytAktivitetRoute = (aktivitetId: string, fnr?: string) => fnrPath(fnr) + `/aktivitet/avbryt/${aktivitetId}`;
const hovedsideRoute = (fnr?: string) => `${fnr ? `/${fnr}` : '/'}`;
const malRoute = (fnr?: string) => fnrPath(fnr) + `/mal`;
const informasjonRoute = (fnr?: string) => fnrPath(fnr) + `/informasjon`;

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
