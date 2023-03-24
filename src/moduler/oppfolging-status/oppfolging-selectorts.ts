import { Store } from 'redux';
import { createSelector } from 'reselect';

import { HistoriskOppfolgingsPeriode } from '../../datatypes/oppfolgingTypes';
import { selectOppfolgingsPerioder } from './oppfolging-selector';

export const selectHistoriskeOppfolgingsPerioder: (store: Store) => HistoriskOppfolgingsPeriode[] = createSelector(
    selectOppfolgingsPerioder,
    (oppfolgingsPerioder) => oppfolgingsPerioder.filter((p) => p.sluttDato) as HistoriskOppfolgingsPeriode[]
);

export const selectForrigeHistoriskeSluttDato: (store: Store) => string | undefined = createSelector(
    selectHistoriskeOppfolgingsPerioder,
    (historiskeOppfolgingsPerioder) =>
        historiskeOppfolgingsPerioder
            .map((p) => p.sluttDato)
            .sort()
            .reverse()[0]
);
