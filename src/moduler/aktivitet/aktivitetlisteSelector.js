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

export const selectAktiviterForAktuellePerioden = (state) =>
    selectAlleAktiviter(state).filter((a) => selectDatoErIPeriode(a.opprettetDato, state));

export const selectAktivitetListe = (state) =>
    selectAktiviterForAktuellePerioden(state).filter((a) => aktivitetFilter(a, state));

export const selectAktivitetMedId = (state, aktivitetId) =>
    selectAlleAktiviter(state).find((aktivitet) => aktivitet.id === aktivitetId);

export const selectAktivitetListeSlice = (state) => {
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
};

export const selectAktivitetListeStatus = (state) => selectAktivitetListeSlice(state).status;

export const selectKanEndreAktivitetStatus = (state, aktivitet) => {
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

export const selectKanEndreAktivitetEtikett = (state, aktivitet) => {
    if (!aktivitet) {
        return false;
    }
    const { historisk, type } = aktivitet;

    return !historisk && (selectErVeileder(state) || type !== MOTE_TYPE);
};

export const selectKanEndreAktivitetDetaljer = (state, aktivitet) => {
    if (!aktivitet) {
        return false;
    }
    const { avtalt, type } = aktivitet;
    return (
        selectKanEndreAktivitetStatus(state, aktivitet) &&
        type !== SAMTALEREFERAT_TYPE &&
        (avtalt !== true || !!window.appconfig.TILLAT_SET_AVTALT)
    );
};

export const selectAktivitetListeFeilMelding = (state) => {
    const alleAktiviteterSlice = [selectAktiviteterSlice(state), selectArenaAktiviteterSlice(state)];
    const feilendeKall = alleAktiviteterSlice.filter((slice) => slice.status === STATUS.ERROR);

    return feilendeKall.map((slice) => slice.feil);
};
