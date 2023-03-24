import { createSelector } from 'reselect';

import { HistoriskOppfolgingsperiode, Oppfolgingsperiode } from '../../datatypes/oppfolgingTypes';
import { selectOppfolgingsPerioder } from './oppfolging-selector';

export const selectHistoriskeOppfolgingsPerioder: (
    oppfolgingsPerioder: Oppfolgingsperiode[]
) => HistoriskOppfolgingsperiode[] = createSelector(
    selectOppfolgingsPerioder,
    (oppfolgingsPerioder) => oppfolgingsPerioder.filter((p) => p.sluttDato) as HistoriskOppfolgingsperiode[]
);

export const selectForrigeHistoriskeSluttDato: (oppfolgingsPerioder: Oppfolgingsperiode[]) => string = createSelector(
    selectHistoriskeOppfolgingsPerioder,
    (historiskeOppfolgingsPerioder) =>
        historiskeOppfolgingsPerioder
            .map((p) => p.sluttDato)
            .sort()
            .reverse()[0]
);
