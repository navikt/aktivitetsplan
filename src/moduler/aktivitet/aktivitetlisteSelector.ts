import { createSelector } from 'reselect';

import { STATUS, aggregerStatus } from '../../api/utils';
import { AppConfig } from '../../app';
import { BEHANDLING_AKTIVITET_TYPE, MOTE_TYPE, STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../constant';
import { AlleAktiviteter, isArenaAktivitet } from '../../datatypes/aktivitetTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { State } from '../../reducer';
import { aktivitetMatchesFilters, selectDatoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectErVeileder, selectIdentitetStatus } from '../identitet/identitet-selector';
import { selectOppfolgingStatus } from '../oppfolging-status/oppfolging-selector';
import { selectAktivitetStatus, selectAktiviteterData, selectAktiviteterSlice } from './aktivitet-selector';
import { selectArenaAktiviteterData, selectArenaAktiviteterSlice } from './arena-aktivitet-selector';

export const selectAlleAktiviter: (state: State) => AlleAktiviteter[] = createSelector(
    selectAktiviteterData,
    selectArenaAktiviteterData,
    (aktiviteter, arenaAktiviteter) => aktiviteter.concat(arenaAktiviteter)
);

export const selectAktiviterForAktuellePerioden = (state: State): AlleAktiviteter[] =>
    selectAlleAktiviter(state).filter((a: AlleAktiviteter) => selectDatoErIPeriode(a.opprettetDato, state));

export const selectAktivitetListe = (state: any) =>
    selectAktiviterForAktuellePerioden(state).filter((a: AlleAktiviteter) => aktivitetMatchesFilters(a, state));

export const selectAktivitetMedId = (state: any, aktivitetId: string) =>
    selectAlleAktiviter(state).find((aktivitet: AlleAktiviteter) => {
        if (isArenaAktivitet(aktivitet)) {
            return aktivitet.id === aktivitetId || aktivitet?.aktivitetId?.toString() === aktivitetId;
        } else {
            return aktivitet.id === aktivitetId;
        }
    });

export const selectAktivitetListeSlice = (state: State) => {
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

export const selectAktivitetListeStatus = (state: State) => selectAktivitetListeSlice(state).status;

export const selectKanEndreAktivitetStatus = (state: State, aktivitet: VeilarbAktivitet) => {
    if (!aktivitet) {
        return false;
    }
    const { historisk, status, type } = aktivitet;
    return (
        !historisk &&
        type !== VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE &&
        (selectErVeileder(state) || type !== MOTE_TYPE) &&
        status !== STATUS_AVBRUTT &&
        status !== STATUS_FULLFOERT
    );
};

export const selectKanEndreAktivitetEtikett = (state: State, aktivitet: VeilarbAktivitet) => {
    if (!aktivitet) {
        return false;
    }
    const { historisk, type } = aktivitet;

    return !historisk && (selectErVeileder(state) || type !== MOTE_TYPE);
};

declare const window: {
    appconfig: AppConfig;
};

export const selectKanEndreAktivitetDetaljer = (state: State, aktivitet: VeilarbAktivitet) => {
    if (!aktivitet) {
        return false;
    }
    const { avtalt, type } = aktivitet;
    return (
        selectKanEndreAktivitetStatus(state, aktivitet) &&
        type !== VeilarbAktivitetType.STILLING_FRA_NAV_TYPE &&
        (avtalt !== true || !!window.appconfig.TILLAT_SET_AVTALT || type === BEHANDLING_AKTIVITET_TYPE)
    );
};

export const selectAktivitetListeFeilMelding = (state: State) => {
    const alleAktiviteterSlice = [selectAktiviteterSlice(state), selectArenaAktiviteterSlice(state)];
    const feilendeKall = alleAktiviteterSlice.filter((slice) => slice.status === STATUS.ERROR);

    return feilendeKall.map((slice) => slice.feil);
};
