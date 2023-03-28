import { createSelector } from 'reselect';

import { STATUS, aggregerStatus } from '../../api/utils';
import { AppConfig } from '../../app';
import { BEHANDLING_AKTIVITET_TYPE, MOTE_TYPE } from '../../constant';
import { AktivitetStatus, AlleAktiviteter } from '../../datatypes/aktivitetTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { aktivitetMatchesFilters, selectDatoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectErVeileder, selectIdentitetStatus } from '../identitet/identitet-selector';
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

export const selectKanEndreAktivitetStatus = (state: any, aktivitet: VeilarbAktivitet) => {
    if (!aktivitet) {
        return false;
    }
    const { historisk, status, type } = aktivitet;
    return (
        !historisk &&
        type !== VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE &&
        (selectErVeileder(state) || type !== MOTE_TYPE) &&
        status !== AktivitetStatus.AVBRUTT &&
        status !== AktivitetStatus.FULLFOERT
    );
};

export const selectKanEndreAktivitetEtikett = (state: any, aktivitet: VeilarbAktivitet) => {
    if (!aktivitet) {
        return false;
    }
    const { historisk, type } = aktivitet;

    return !historisk && (selectErVeileder(state) || type !== MOTE_TYPE);
};

export const selectKanEndreAktivitetDetaljer = (state: any, aktivitet: VeilarbAktivitet) => {
    if (!aktivitet) {
        return false;
    }
    const { avtalt, type } = aktivitet;
    return (
        selectKanEndreAktivitetStatus(state, aktivitet) &&
        (selectErVeileder(state) || type !== VeilarbAktivitetType.SAMTALEREFERAT_TYPE) &&
        type !== VeilarbAktivitetType.STILLING_FRA_NAV_TYPE &&
        (avtalt !== true || selectErVeileder(state) || type === BEHANDLING_AKTIVITET_TYPE)
    );
};

export const selectAktivitetListeFeilMelding = (state: any) => {
    const alleAktiviteterSlice = [selectAktiviteterSlice(state), selectArenaAktiviteterSlice(state)];
    const feilendeKall = alleAktiviteterSlice.filter((slice) => slice.status === STATUS.ERROR);

    return feilendeKall.map((slice) => slice.feil);
};
