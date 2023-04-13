import { createSelector } from 'reselect';

import { STATUS, aggregerStatus } from '../../api/utils';
import { BEHANDLING_AKTIVITET_TYPE, MOTE_TYPE, SAMTALEREFERAT_TYPE, STILLING_FRA_NAV_TYPE } from '../../constant';
import { AktivitetStatus, AlleAktiviteter, isArenaAktivitet } from '../../datatypes/aktivitetTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { aktivitetMatchesFilters, selectDatoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectIdentitetStatus } from '../identitet/identitet-selector';
import { selectOppfolgingStatus } from '../oppfolging-status/oppfolging-selector';
import { selectAktivitetStatus, selectAktiviteterData, selectAktiviteterSlice } from './aktivitet-selector';
import { selectArenaAktiviteterData, selectArenaAktiviteterSlice } from './arena-aktivitet-selector';

export const selectAlleAktiviter: (state: any) => AlleAktiviteter[] = createSelector(
    selectAktiviteterData,
    selectArenaAktiviteterData,
    (aktiviteter, arenaAktiviteter) => aktiviteter.concat(arenaAktiviteter)
);

export const selectAktiviterForAktuellePerioden = (state: any): AlleAktiviteter[] =>
    selectAlleAktiviter(state).filter((a: AlleAktiviteter) => selectDatoErIPeriode(a.opprettetDato, state));

export const selectAktivitetListe = (state: any) =>
    selectAktiviterForAktuellePerioden(state).filter((a: AlleAktiviteter) => aktivitetMatchesFilters(a, state));

export const selectAktivitetMedId = (state: any, aktivitetId: string) =>
    selectAlleAktiviter(state).find((aktivitet: AlleAktiviteter) => {
        return aktivitet.id === aktivitetId;
    });

export const selectAktivitetListeSlice = (state: any) => {
    const status = aggregerStatus(
        selectOppfolgingStatus(state),
        selectIdentitetStatus(state),
        selectAktivitetStatus(state)
    );
    return {
        status,
        data: selectAktivitetListe(state),
    };
};

export const selectAktivitetListeStatus = (state: any) => selectAktivitetListeSlice(state).status;

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

export const selectAktivitetListeFeilMelding = (state: any) => {
    const alleAktiviteterSlice = [selectAktiviteterSlice(state), selectArenaAktiviteterSlice(state)];
    const feilendeKall = alleAktiviteterSlice.filter((slice) => slice.status === STATUS.ERROR);

    return feilendeKall.map((slice) => slice.feil);
};
