import { maksLengde } from '../../../felles-komponenter/skjema/validering';

export const BESKRIVELSE_MAKS_LENGDE = 500;

export const begrensetBeskrivelseLengde = maksLengde(
    'instillinger.feilmelding.opprett-oppgave.beskrivelse.for.lang',
    BESKRIVELSE_MAKS_LENGDE
);

export const OPPFOLGING = 'OPPFOLGING';

export const temaValg = {
    OPPFOLGING: 'Oppfolging',
    DAGPENGER: 'Dagpenger',
    ARBEIDSAVKLARING: 'Arbeidsavklaring',
    INDIVIDSTONAD: 'Individstønad (Tiltakspenger)',
    ENSLIG_FORSORGER: 'Enslig forsørger',
    TILLEGGSTONAD: 'Tillegsstønad',
};

export const prioritet = {
    LAV: 'Lav',
    NORMAL: 'Normal',
    HOY: 'Høy',
};

export const defaultPrioritet = 'NORMAL';

export const VURDER_KONSEKVENS_FOR_YTELSE = 'VURDER_KONSEKVENS_FOR_YTELSE';

export const oppgavetyper = {
    VURDER_KONSEKVENS_FOR_YTELSE: 'Vurder konsekvens for ytelse',
    VURDER_HENVENDELSE: 'Vurder henvendelse',
};

export const IKKE_VALGT = 'IKKE_VALGT';

export function enhetlisteToKeyValueMap(enhetliste) {
    return enhetliste.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.enhetId]: `${curr.enhetId} ${curr.navn}`,
        }),
        {}
    );
}

export function veilederlisteToKeyValueMap(veilederliste) {
    return veilederliste.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.ident]: curr.navn,
        }),
        {}
    );
}
export function deleteKeyFromObject(object, deleteKey) {
    return Object.entries(object)
        .filter(([key, _]) => key !== deleteKey)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

export function filtrerBasertPaaTema(typer, tema) {
    switch (tema) {
        case OPPFOLGING: {
            return deleteKeyFromObject(typer, VURDER_KONSEKVENS_FOR_YTELSE);
        }
        default:
            return oppgavetyper;
    }
}

function pad(number) {
    return number < 10 ? `0${number}` : number;
}

export function toLocalDateTime(date) {
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
        date.getUTCDate()
    )}`;
}
