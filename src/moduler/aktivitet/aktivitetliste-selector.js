import { createSelector } from 'reselect';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE, STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../constant';
import { STATUS, aggregerStatus } from '../../ducks/utils';
import { aktivitetFilter, selectDatoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectErVeileder, selectIdentitetStatus } from '../identitet/identitet-selector';
import { selectOppfolgingStatus } from '../oppfolging-status/oppfolging-selector';
import { selectAktivitetStatus, selectAktiviteterData, selectAktiviteterSlice } from './aktivitet-selector';
import {
    selectArenaAktivitetStatus,
    selectArenaAktiviteterData,
    selectArenaAktiviteterSlice,
} from './arena-aktivitet-selector';

export const selectAlleAktiviter = createSelector(
    selectAktiviteterData,
    selectArenaAktiviteterData,
    (aktiviteter, arenaAktiviteter) => aktiviteter.concat(arenaAktiviteter)
);

export function selectAktiviterForAktuellePerioden(state) {
    return selectAlleAktiviter(state).filter((a) => selectDatoErIPeriode(a.opprettetDato, state));
}

export function selectAktivitetListe(state) {
    return selectAktiviterForAktuellePerioden(state).filter((a) => aktivitetFilter(a, state));
}

export function selectAktivitetMedId(state, aktivitetId) {
    return selectAlleAktiviter(state).find((aktivitet) => aktivitet.id === aktivitetId);
}

export function selectAktivitetListeSlice(state) {
    const status = aggregerStatus(
        selectOppfolgingStatus(state),
        selectIdentitetStatus(state),
        selectAktivitetStatus(state),
        selectArenaAktivitetStatus(state)
    );
    return {
        status,
        data: selectAktivitetListe(state),
    };
}

export function selectAktivitetListeStatus(state) {
    return selectAktivitetListeSlice(state).status;
}

export function selectKanEndreAktivitetStatus(state, aktivitet) {
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
}

export function selectKanEndreAktivitetEtikett(state, aktivitet) {
    if (!aktivitet) {
        return false;
    }
    const { historisk, type } = aktivitet;

    return !historisk && (selectErVeileder(state) || type !== MOTE_TYPE);
}

export function selectKanEndreAktivitetDetaljer(state, aktivitet) {
    if (!aktivitet) {
        return false;
    }
    const { avtalt, type } = aktivitet;
    return (
        selectKanEndreAktivitetStatus(state, aktivitet) &&
        type !== SAMTALEREFERAT_TYPE &&
        (avtalt !== true || !!window.appconfig.TILLAT_SET_AVTALT)
    );
}

export function selectAktivitetListeFeilMelding(state) {
    const alleAktiviteterSlice = [selectAktiviteterSlice(state), selectArenaAktiviteterSlice(state)];
    const feilendeKall = alleAktiviteterSlice.filter((slice) => slice.status === STATUS.ERROR);

    return feilendeKall.map((slice) => slice.feil);
}
