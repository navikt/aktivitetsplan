import { selectAktivitetStatus } from './aktivitet-selector';
import { selectArenaAktivitetStatus } from './arena-aktivitet-selector';
import { aggregerStatus } from '../../ducks/utils';
import {
    selectPrivatModusSlice,
    selectErPrivatModus,
} from '../privat-modus/privat-modus-selector';
import {
    aktivitetFilter,
    datoErIPeriode,
} from '../filtrering/filter/filter-utils';
import { selectErVeileder } from '../identitet/identitet-selector';
import {
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    STATUS_AVBRUTT,
    STATUS_FULLFOERT,
} from '../../constant';
import { TILLAT_SET_AVTALT } from '~config'; // eslint-disable-line

export function selectAktiviter(state) {
    const stateData = state.data;
    return stateData.aktiviteter.data;
}

export function selectAlleAktiviter(state) {
    const stateData = state.data;
    return selectAktiviter(state).concat(stateData.arenaAktiviteter.data);
}

export function selectAktiviterForAktuellePerioden(state) {
    return selectAlleAktiviter(state).filter(a =>
        datoErIPeriode(a.opprettetDato, state)
    );
}

export function selectAktivitetListe(state) {
    const privatModus = selectErPrivatModus(state);
    return selectAktiviterForAktuellePerioden(state)
        .filter(a => !privatModus || a.historisk || a.arenaAktivitet)
        .filter(a => aktivitetFilter(a, state));
}

export function selectAktivitetMedId(state, aktivitetId) {
    return selectAktivitetListe(state).find(
        aktivitet => aktivitet.id === aktivitetId
    );
}

export function selectAktivitetListeReducer(state) {
    const status = aggregerStatus(
        selectPrivatModusSlice(state),
        selectAktivitetStatus(state),
        selectArenaAktivitetStatus(state)
    );
    return {
        status,
        data: selectAktivitetListe(state),
    };
}

export function selectAktivitetListeStatus(state) {
    return selectAktivitetListeReducer(state).status;
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

export function selectKanEndreAktivitetDetaljer(state, aktivitet) {
    if (!aktivitet) {
        return false;
    }
    const { avtalt, type } = aktivitet;
    return (
        selectKanEndreAktivitetStatus(state, aktivitet) &&
        type !== SAMTALEREFERAT_TYPE &&
        (avtalt !== true || !!TILLAT_SET_AVTALT)
    );
}
