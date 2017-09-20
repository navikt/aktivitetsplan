import React from 'react';
import queryString from 'query-string';
import { maksLengde } from '../../../felles-komponenter/skjema/validering';

export const BESKRIVELSE_MAKS_LENGDE = 500;

export const begrensetBeskrivelseLengde = maksLengde(
    'instillinger.feilmelding.opprett-oppgave.beskrivelse.for.lang',
    BESKRIVELSE_MAKS_LENGDE
);

export const OPPFOLGING = 'OPPFOLGING';

export const temaValg = {
    OPPFOLGING: 'opprett-oppgave.form.tema.oppfolging',
    DAGPENGER: 'opprett-oppgave.form.tema.dagpenger',
    ARBEIDSAVKLARING: 'opprett-oppgave.form.tema.arbeidsavklaring',
    INDIVIDSTONAD: 'opprett-oppgave.form.tema.individstonad',
    ENSLIG_FORSORGER: 'opprett-oppgave.form.tema.ensligforsorger',
    TILLEGGSTONAD: 'opprett-oppgave.form.tema.tilleggstonad',
};

export const prioritet = {
    LAV: 'opprett-oppgave.form.prioritet.lav',
    NORMAL: 'opprett-oppgave.form.prioritet.normal',
    HOY: 'opprett-oppgave.form.prioritet.hoy',
};

export const defaultPrioritet = 'NORMAL';

export const VURDER_KONSEKVENS_FOR_YTELSE = 'VURDER_KONSEKVENS_FOR_YTELSE';

export const oppgavetyper = {
    VURDER_KONSEKVENS_FOR_YTELSE: 'opprett-oppgave.form.type.vurder.konsekvens.for.ytelse',
    VURDER_HENVENDELSE: 'opprett-oppgave.form.type.vurder.henvendelse',
};

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
export function slettFeltFraObjekt(object, deleteKey) {
    return Object.entries(object)
        .filter(([key, _]) => key !== deleteKey)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

export function filtrerBasertPaTema(typer, tema) {
    switch (tema) {
        case OPPFOLGING: {
            return slettFeltFraObjekt(typer, VURDER_KONSEKVENS_FOR_YTELSE);
        }
        default:
            return oppgavetyper;
    }
}

export function optionsFromObjectWithIntl(keyValueMap, intl) {
    return Object.entries(keyValueMap).map(([key, value]) =>
        <option value={key} key={key}>
            {intl ?
                intl.formatMessage({
                    id: value,
                })
                :
                value
            }
        </option>
    );
}

export const getEnhetFromUrl = () => queryString.parse(location.search).enhet;

export function erValgtEnhetLikInnloggetEnhet(valgtEnhet) {
    const innloggetEnhet = getEnhetFromUrl();
    return innloggetEnhet === valgtEnhet && !!innloggetEnhet;
}
