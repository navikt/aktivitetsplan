export const fnrPath = (fnr?: string) => (fnr ? `/${fnr}` : '');
export const aktivitetRoute = (aktivitetId: string, fnr?: string) => fnrPath(fnr) + `/aktivitet/vis/${aktivitetId}`;
export const nyAktivitetRoute = (fnr?: string) => `${fnrPath(fnr)}/aktivitet/ny`;
export const endreAktivitetRoute = (aktivitetId: string, fnr?: string) =>
    fnrPath(fnr) + `/aktivitet/endre/${aktivitetId}`;
export const fullforAktivitetRoute = (aktivitetId: string, fnr?: string) =>
    fnrPath(fnr) + `/aktivitet/fullfor/${aktivitetId}`;
export const avbrytAktivitetRoute = (aktivitetId: string, fnr?: string) =>
    fnrPath(fnr) + `/aktivitet/avbryt/${aktivitetId}`;
export const hovedsideRoute = (fnr?: string) => `${fnr ? `/${fnr}` : '/'}`;
export const malRoute = (fnr?: string) => fnrPath(fnr) + `/mal`;
export const informasjonRoute = (fnr?: string) => fnrPath(fnr) + `/informasjon`;
