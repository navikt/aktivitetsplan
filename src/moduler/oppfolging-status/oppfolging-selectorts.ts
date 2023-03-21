import { createSelector } from 'reselect';

import { HistoriskOppfolgingsPeriode, OppfolgingsPeriode } from '../../datatypes/oppfolgingTypes';
import { selectOppfolgingsPerioder } from './oppfolging-selector';

export const selectHistoriskeOppfolgingsPerioder: (
    oppfolgingsPerioder: OppfolgingsPeriode[]
) => HistoriskOppfolgingsPeriode[] = createSelector(
    selectOppfolgingsPerioder,
    (oppfolgingsPerioder) => oppfolgingsPerioder.filter((p) => p.sluttDato) as HistoriskOppfolgingsPeriode[]
);

export const selectForrigeHistoriskeSluttDato: (oppfolgingsPerioder: OppfolgingsPeriode[]) => string = createSelector(
    selectHistoriskeOppfolgingsPerioder,
    (historiskeOppfolgingsPerioder) =>
        historiskeOppfolgingsPerioder
            .map((p) => p.sluttDato)
            .sort()
            .reverse()[0]
);
