import { createSelector } from 'reselect';

import { AvsluttetOppfolgingsPeriode, OppfolgingsPeriode } from '../../datatypes/oppfolgingTypes';
import { State } from '../../reducer';
import { selectOppfolgingsPerioder } from './oppfolging-selector';

const erAvsluttet = (periode: OppfolgingsPeriode): periode is AvsluttetOppfolgingsPeriode => {
    return !!periode.sluttDato;
};

export const selectHistoriskeOppfolgingsPerioder: (oppfolgingsPerioder: State) => AvsluttetOppfolgingsPeriode[] =
    createSelector(selectOppfolgingsPerioder, (oppfolgingsPerioder) => oppfolgingsPerioder.filter(erAvsluttet));

export const selectForrigeHistoriskeSluttDato: (oppfolgingsPerioder: State) => string | undefined = createSelector(
    selectHistoriskeOppfolgingsPerioder,
    (historiskeOppfolgingsPerioder) =>
        historiskeOppfolgingsPerioder
            .map((periode) => periode.sluttDato)
            .sort()
            .reverse()[0]
);
