import { createSelector } from 'reselect';

import { selectOppfolgingsPerioder } from './oppfolging-selector';

export const selectHistoriskeOppfolgingsPerioder: (
    oppfolgingsPerioder: { sluttDato: string }[]
) => { sluttDato: string }[] = createSelector(selectOppfolgingsPerioder, (oppfolgingsPerioder) =>
    oppfolgingsPerioder.filter((p: { sluttDato: Date }) => p.sluttDato)
);

export const selectForrigeHistoriskeSluttDato: (oppfolgingsPerioder: { sluttDato: string }[]) => string =
    createSelector(
        selectHistoriskeOppfolgingsPerioder,
        (historiskeOppfolgingsPerioder) =>
            historiskeOppfolgingsPerioder
                .map((p: { sluttDato: string }) => p.sluttDato)
                .sort()
                .reverse()[0]
    );
