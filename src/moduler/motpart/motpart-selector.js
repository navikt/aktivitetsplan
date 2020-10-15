import { createSelector } from 'reselect';
import { storeForbokstaver } from '../../utils';
import { selectErVeileder } from '../identitet/identitet-selector';

export function selectMotpartSlice(state) {
    return state.data.bruker;
}

export function selectMotpartStatus(state) {
    return selectMotpartSlice(state).status;
}

export function selectMotpartData(state) {
    return selectMotpartSlice(state).data;
}

export const selectFnrPaMotpartHvisBruker = createSelector(selectMotpartData, selectErVeileder, (motpart, erVeileder) =>
    erVeileder ? motpart.fodselsnummer : ''
);

export const selectNavnPaMotpart = createSelector(selectMotpartData, selectErVeileder, (motpart, erVeileder) => {
    const navn = storeForbokstaver(motpart.fornavn, motpart.mellomnavn, motpart.etternavn);
    return erVeileder ? navn : 'NAV';
});
