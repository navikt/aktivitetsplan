import { aggregerStatus } from '../../ducks/utils';
import {
    selectPrivatModusSlice,
    selectErPrivatModus,
} from '../privat-modus/privat-modus-selector';
import { aktivitetFilter } from '../filter/filter-utils';
import { selectErVeileder } from '../identitet/identitet-selector';
import {
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    STATUS_AVBRUTT,
    STATUS_FULLFOERT,
} from '../../constant';
import { TILLAT_SET_AVTALT } from '~config'; // eslint-disable-line

export function selectAlleAktiviter(state) {
    const stateData = state.data;
    return stateData.aktiviteter.data.concat(stateData.arenaAktiviteter.data);
}

export function selectAktivitetListe(state) {
    const privatModus = selectErPrivatModus(state);
    return selectAlleAktiviter(state)
        .filter(a => !privatModus || a.historisk)
        .filter(a => aktivitetFilter(a, state));
}

export function selectAktivitetMedId(state, aktivitetId) {
    return selectAktivitetListe(state).find(
        aktivitet => aktivitet.id === aktivitetId
    );
}

export function selectAktivitetListeReducer(state) {
    return {
        status: aggregerStatus(
            selectPrivatModusSlice(state),
            state.aktiviteter,
            state.arenaAktiviteter
        ),
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
        (selectErVeileder(state) ||
            (type !== MOTE_TYPE && type !== SAMTALEREFERAT_TYPE)) &&
        status !== STATUS_AVBRUTT &&
        status !== STATUS_FULLFOERT
    );
}

export function selectKanEndreAktivitetDetaljer(state, aktivitet) {
    if (!aktivitet) {
        return false;
    }
    const { avtalt } = aktivitet;
    return (
        selectKanEndreAktivitetStatus(state, aktivitet) &&
        (avtalt !== true || !!TILLAT_SET_AVTALT)
    );
}
