import {
    maksLengde,
    pakrevd,
} from '../../../felles-komponenter/skjema/validering';

export const BESKRIVELSE_MAKS_LENGDE = 500;

export const begrensetBeskrivelseLengde = maksLengde(
    'instillinger.feilmelding.opprett-oppgave.beskrivelse.for.lang',
    BESKRIVELSE_MAKS_LENGDE
);

export const pakrevdBeskrivelse = pakrevd(
    'instillinger.feilmelding.opprett-oppgave.beskrivelse.pakrevd'
);

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
