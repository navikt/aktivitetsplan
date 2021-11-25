import { createSelector } from 'reselect';

import { STATUS, aggregerStatus } from '../../api/utils';
import {
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    STATUS_AVBRUTT,
    STATUS_FULLFOERT,
    STILLING_FRA_NAV_TYPE,
} from '../../constant';
import { Aktivitet } from '../../datatypes/aktivitetTypes';
import { aktivitetFilter, selectDatoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectErVeileder, selectIdentitetStatus } from '../identitet/identitet-selector';
import { selectOppfolgingStatus } from '../oppfolging-status/oppfolging-selector';
import { selectAktivitetStatus, selectAktiviteterData, selectAktiviteterSlice } from './aktivitet-selector';
import { selectArenaAktiviteterData, selectArenaAktiviteterSlice } from './arena-aktivitet-selector';

export const selectAlleAktiviter = createSelector(
    selectAktiviteterData,
    selectArenaAktiviteterData,
    (aktiviteter, arenaAktiviteter) => aktiviteter.concat(arenaAktiviteter)
);

export const selectAktiviterForAktuellePerioden = (state: any): Aktivitet[] =>
    selectAlleAktiviter(state).filter((a: Aktivitet) => selectDatoErIPeriode(a.opprettetDato, state));

export const selectAktivitetListe = (state: any) =>
    selectAktiviterForAktuellePerioden(state).filter((a: Aktivitet) => aktivitetFilter(a, state));

export const selectAktivitetMedId = (state: any, aktivitetId: string) =>
    selectAlleAktiviter(state).find((aktivitet: Aktivitet) => aktivitet.id === aktivitetId);

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

export const selectKanEndreAktivitetStatus = (state: any, aktivitet: Aktivitet) => {
    if (!aktivitet) {
        return false;
    }
    const { historisk, status, type } = aktivitet;
    return (
        !historisk &&
        (selectErVeileder(state) || type !== MOTE_TYPE) &&
        status !== STATUS_AVBRUTT &&
        status !== STATUS_FULLFOERT
    );
};

export const selectKanEndreAktivitetEtikett = (state: any, aktivitet: Aktivitet) => {
    if (!aktivitet) {
        return false;
    }
    const { historisk, type } = aktivitet;

    return !historisk && (selectErVeileder(state) || type !== MOTE_TYPE);
};

export const selectKanEndreAktivitetDetaljer = (state: any, aktivitet: Aktivitet) => {
    if (!aktivitet) {
        return false;
    }
    const { avtalt, type } = aktivitet;
    return (
        selectKanEndreAktivitetStatus(state, aktivitet) &&
        type !== SAMTALEREFERAT_TYPE &&
        type !== STILLING_FRA_NAV_TYPE &&
        // @ts-ignore
        (avtalt !== true || !!window.appconfig.TILLAT_SET_AVTALT)
    );
};

export const selectAktivitetListeFeilMelding = (state: any) => {
    const alleAktiviteterSlice = [selectAktiviteterSlice(state), selectArenaAktiviteterSlice(state)];
    const feilendeKall = alleAktiviteterSlice.filter((slice) => slice.status === STATUS.ERROR);

    return feilendeKall.map((slice) => slice.feil);
};
