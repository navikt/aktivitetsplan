import { createSelector } from 'reselect';
import { moment } from '../../utils';
import { newDatoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectForrigeHistoriskeSluttDato } from '../oppfolging-status/oppfolging-selector';
import { erViktigMelding } from './dialog-utils';
import { selectErBruker, selectErVeileder } from '../identitet/identitet-selector';
import { STATUS } from '../../ducks/utils';

function selectDialogSlice(state) {
    return state.data.dialog;
}

function selectDialogViewSlice(state) {
    return state.view.dialog;
}

export function selectDialogStatus(state) {
    return selectDialogSlice(state).status;
}

export function selectEskaleringsFilter(state) {
    return selectDialogSlice(state).esklaringsFilter;
}

export function selectAlleDialoger(state) {
    return selectDialogSlice(state).data;
}

const hentDialogerFraState = (dialoger, esklaringsFilter, historiskPeriode, forrigeSluttDato) =>
    dialoger.data
        .filter(d => newDatoErIPeriode(d.opprettetDato, historiskPeriode, forrigeSluttDato))
        .filter(d => erViktigMelding(d) || !esklaringsFilter);

export const selectDialoger = createSelector(
    [selectDialogSlice, selectEskaleringsFilter, selectHistoriskPeriode, selectForrigeHistoriskeSluttDato],
    hentDialogerFraState
);

export function selectDialogMedId(state, dialogId) {
    return selectDialoger(state).find(d => d.id === dialogId);
}

export function createSelectDialogForAktivitetId(aktivitetId) {
    return state => selectDialogForAktivitetId(state, aktivitetId);
}

export function selectDialogForAktivitetId(state, aktivitetId) {
    return selectAlleDialoger(state).find(d => d.aktivitetId === aktivitetId);
}

export function selectHarUbehandledeDialoger(state) {
    const data = selectDialoger(state);
    return (
        data.filter(dialog => dialog.historisk === false && (dialog.ferdigBehandlet === false || dialog.venterPaSvar))
            .length > 0
    );
}

export function selectHarEskaleringer(state) {
    return selectDialoger(state).filter(erViktigMelding).length > 0;
}

export function selectVisEskaleringsFilter(state) {
    return selectHarEskaleringer(state) && selectErBruker(state);
}

export function selectTilpasseDialogModalHistoriskVisning(state) {
    return selectErVeileder(state) || (!selectHarEskaleringer(state) && selectErBruker(state));
}

export function selectVisBrukerInfo(state, dialogId_) {
    const { dialogId, utlopTidspunkt } = selectDialogViewSlice(state).data;
    return !!utlopTidspunkt && moment(utlopTidspunkt).isAfter(moment()) && dialogId === dialogId_;
}

export function selectHarTilgangTilDialog(state) {
    return selectDialogStatus(state) === STATUS.OK;
}

export const selectDialogFeilmeldinger = state => {
    const feilMeldingsdata = selectDialogStatus(state) === STATUS.ERROR && selectDialogSlice(state).feil;
    return feilMeldingsdata ? [feilMeldingsdata] : [];
};
