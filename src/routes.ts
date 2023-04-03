import { useFnr } from './Provider';

const aktivitetRoute = (aktivitetId: string, fnr?: string) => `${fnr ? `/${fnr}` : ''}/aktivitet/vis/${aktivitetId}`;
const nyAktivitetRoute = (fnr?: string) => `${fnr ? `/${fnr}` : ''}/aktivitet/ny`;
const endreAktivitetRoute = (aktivitetId: string, fnr?: string) =>
    `${fnr ? `/${fnr}` : ''}/aktivitet/endre/${aktivitetId}`;
const fullforAktivitetRoute = (aktivitetId: string, fnr?: string) =>
    `${fnr ? `/${fnr}` : ''}/aktivitet/fullfor/${aktivitetId}`;
const avbrytAktivitetRoute = (aktivitetId: string, fnr?: string) =>
    `${fnr ? `/${fnr}` : ''}/aktivitet/avbryt/${aktivitetId}`;
const hovedsideRoute = (fnr?: string) => `${fnr ? `/${fnr}` : '/'}`;
const malRoute = (fnr?: string) => `${fnr ? `/${fnr}` : ''}/mal`;

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
    };
};
