import { createSelector } from 'reselect';

import { aggregerStatus } from '../../api/utils';
import { BEHANDLING_AKTIVITET_TYPE, MOTE_TYPE, SAMTALEREFERAT_TYPE, STILLING_FRA_NAV_TYPE } from '../../constant';
import { AktivitetStatus, AlleAktiviteter, isArenaAktivitet } from '../../datatypes/aktivitetTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { RootState } from '../../store';
import { aktivitetMatchesFilters } from '../filtrering/filter/filter-utils';
import { selectIdentitetStatus } from '../identitet/identitet-selector';
import { selectOppfolgingsPerioder, selectOppfolgingStatus } from '../oppfolging-status/oppfolging-selector';
import { selectAktivitetStatus, selectAktiviteterData, selectAktiviteterByPeriode } from './aktivitet-selector';
import { selectArenaAktiviteterData } from './arena-aktivitet-selector';
import { selectHistoriskPeriode } from '../filtrering/filter/filter-selector';

export const selectAlleAktiviter: (state: RootState) => AlleAktiviteter[] = createSelector(
    [selectAktiviteterData, selectArenaAktiviteterData],
    (aktiviteter, arenaAktiviteter) => aktiviteter.concat(arenaAktiviteter),
);

export const selectVistOppfolgingsperiode = createSelector(
    selectHistoriskPeriode,
    selectOppfolgingsPerioder,
    (valgtHistoriskPeriode, oppfolgingsPerioder) => {
        if (valgtHistoriskPeriode) return valgtHistoriskPeriode;

        const inneværendePeriode = oppfolgingsPerioder.find((periode) => !periode.sluttDato);

        if (inneværendePeriode) {
            return inneværendePeriode;
        } else {
            const sorterteHistoriskePerioder = [...oppfolgingsPerioder].sort((a, b) =>
                a.startDato.localeCompare(b.startDato),
            );
            return sorterteHistoriskePerioder[0];
        }
    },
);
export const selectAktiviterForAktuellePerioden = createSelector(
    selectArenaAktiviteterData,
    selectVistOppfolgingsperiode,
    selectAktiviteterByPeriode,
    (arenaAktiviteterIAllePerioder, valgtPeriode, veilarbAktiviteter): AlleAktiviteter[] => {
        return [
            ...(veilarbAktiviteter.find((periode) => periode.id === valgtPeriode?.uuid)?.aktiviteter || []),
            ...arenaAktiviteterIAllePerioder.filter(
                (aktivitet) => aktivitet.oppfolgingsperiodeId === valgtPeriode?.uuid,
            ),
        ];
    },
);

export const selectAktivitetListe = (state: RootState) =>
    selectAktiviterForAktuellePerioden(state).filter((a: AlleAktiviteter) => aktivitetMatchesFilters(a, state));

export const selectAktivitetMedId = (state: RootState, aktivitetId: string) =>
    selectAlleAktiviter(state).find((aktivitet: AlleAktiviteter) => {
        return aktivitet.id === aktivitetId;
    });

export const selectAktivitetListeSlice = (state: RootState) => {
    const status = aggregerStatus(
        selectOppfolgingStatus(state),
        selectIdentitetStatus(state),
        selectAktivitetStatus(state),
    );
    return {
        status,
        data: selectAktivitetListe(state),
    };
};

export const selectAktivitetListeStatus = (state: RootState) => selectAktivitetListeSlice(state).status;

export const kanEndreAktivitetStatus = (aktivitet: VeilarbAktivitet, erVeileder: boolean) => {
    if (!aktivitet) {
        return false;
    }
    const { historisk, status, type } = aktivitet;
    return (
        !historisk &&
        type !== VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE &&
        (erVeileder || type !== MOTE_TYPE) &&
        status !== AktivitetStatus.AVBRUTT &&
        status !== AktivitetStatus.FULLFOERT
    );
};

export const kanEndreAktivitetEtikett = (aktivitet: VeilarbAktivitet, erVeileder: boolean) => {
    if (!aktivitet) {
        return false;
    }
    const { historisk, type } = aktivitet;
    return !historisk && (erVeileder || type !== MOTE_TYPE);
};

export const kanEndreAktivitetDetaljer = (aktivitet: AlleAktiviteter, erVeileder: boolean): boolean => {
    if (!aktivitet) return false;
    if (isArenaAktivitet(aktivitet)) return false;
    const { avtalt, type } = aktivitet;
    return (
        kanEndreAktivitetStatus(aktivitet, erVeileder) &&
        (erVeileder || type !== SAMTALEREFERAT_TYPE) &&
        type !== STILLING_FRA_NAV_TYPE &&
        (!avtalt || erVeileder || type === BEHANDLING_AKTIVITET_TYPE)
    );
};
