const aktivitetRoute = (aktivitetId: string) => `/aktivitet/vis/${aktivitetId}`;
const nyAktivitetRoute = () => `/aktivitet/ny`;
export const endreAktivitetRoute = (aktivitetId: string) => `/aktivitet/endre/${aktivitetId}`;
const fullforAktivitetRoute = (aktivitetId: string) => `/aktivitet/fullfor/${aktivitetId}`;
const avbrytAktivitetRoute = (aktivitetId: string) => `/aktivitet/avbryt/${aktivitetId}`;
const hovedsideRoute = () => '/';
const malRoute = () => `/mal`;
const informasjonRoute = () => `/informasjon`;

export const useRoutes = () => {
    return {
        aktivitetRoute: (aktivitetId: string) => aktivitetRoute(aktivitetId),
        nyAktivitetRoute: () => nyAktivitetRoute(),
        endreAktivitetRoute: (aktivitetId: string) => endreAktivitetRoute(aktivitetId),
        fullforAktivitetRoute: (aktivitetId: string) => fullforAktivitetRoute(aktivitetId),
        avbrytAktivitetRoute: (aktivitetId: string) => avbrytAktivitetRoute(aktivitetId),
        hovedsideRoute: () => hovedsideRoute(),
        malRoute: () => malRoute(),
        informasjonRoute: () => informasjonRoute(),
    };
};
