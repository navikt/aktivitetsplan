import { useErVeileder } from '../Provider';
import { AktivitetsId, AktivitetsVersjon } from '../datatypes/brandedTypes';

const basename = '/aktivitetsplan';
const aktivitetsVersjonRoute = (aktivitetId: AktivitetsId, aktivitetsVersjon: AktivitetsVersjon, erVeileder: boolean) =>
    `${erVeileder ? basename : ''}/aktivitet/vis/${aktivitetId}/versjon/${aktivitetsVersjon}`;
const aktivitetRoute = (aktivitetId: string, erVeileder: boolean) =>
    `${erVeileder ? basename : ''}/aktivitet/vis/${aktivitetId}`;
export const nyAktivitetRoute = (erVeileder: boolean) => `${erVeileder ? basename : ''}/aktivitet/ny`;
export const endreAktivitetRoute = (aktivitetId: string, erVeileder: boolean) =>
    `${erVeileder ? basename : ''}/aktivitet/endre/${aktivitetId}`;
const fullforAktivitetRoute = (aktivitetId: string, erVeileder: boolean) =>
    `${erVeileder ? basename : ''}/aktivitet/fullfor/${aktivitetId}`;
const avbrytAktivitetRoute = (aktivitetId: string, erVeileder: boolean) =>
    `${erVeileder ? basename : ''}/aktivitet/avbryt/${aktivitetId}`;
export const hovedsideRoute = (erVeileder: boolean) => `${erVeileder ? basename : ''}/`;
const malRoute = (erVeileder: boolean) => `${erVeileder ? basename : ''}/mal`;
const informasjonRoute = (erVeileder: boolean) => `${erVeileder ? basename : ''}/informasjon`;

export const useRoutes = () => {
    const erVeileder = useErVeileder();

    return {
        aktivitetRoute: (aktivitetId: string) => aktivitetRoute(aktivitetId, erVeileder),
        aktivitetsVersjonRoute: (aktivitetId: AktivitetsId, versjon: AktivitetsVersjon) =>
            aktivitetsVersjonRoute(aktivitetId, versjon, erVeileder),
        nyAktivitetRoute: () => nyAktivitetRoute(erVeileder),
        endreAktivitetRoute: (aktivitetId: string) => endreAktivitetRoute(aktivitetId, erVeileder),
        fullforAktivitetRoute: (aktivitetId: string) => fullforAktivitetRoute(aktivitetId, erVeileder),
        avbrytAktivitetRoute: (aktivitetId: string) => avbrytAktivitetRoute(aktivitetId, erVeileder),
        hovedsideRoute: () => hovedsideRoute(erVeileder),
        malRoute: () => malRoute(erVeileder),
        informasjonRoute: () => informasjonRoute(erVeileder),
    };
};
