import { SerializedError } from '../../api/utils';
import {
    flyttAktivitet,
    hentAktiviteter,
    lagNyAktivitet,
    oppdaterAktivitetEtikett,
    oppdaterCVSvar,
    oppdaterReferat,
    oppdaterStillingFraNavSoknadsstatus,
    publiserReferat,
    settAktivitetTilAvtalt,
} from '../aktivitet/aktivitet-actions';
import { hentArenaAktiviteter } from '../aktivitet/arena-aktiviteter-slice';
import { hentDialoger } from '../dialog/dialog-slice';
import { hentIdentitet } from '../identitet/identitet-slice';
import { hentLest } from '../lest/lest-slice';
import { hentMal, oppdaterMal } from '../mal/aktivitetsmal-slice';
import { hentMalListe } from '../mal/malliste-slice';
import { hentOppfolging } from '../oppfolging-status/oppfolging-slice';
import { createSelector } from 'reselect';
import { RootState } from '../../store';

export const selectFeil = (errors: RootState['data']['errors'], ...types: string[]): SerializedError[] => {
    return Object.entries(errors)
        .filter(([type, _]) => types.includes(type))
        .map(([_, val]) => val);
};

export const selectErrors = (state: RootState) => state.data.errors;

const hovedsideFeil = [
    hentOppfolging.rejected.type,
    hentIdentitet.rejected.type,
    hentAktiviteter.rejected.type,
    hentArenaAktiviteter.rejected.type,
    hentLest.rejected.type,
    hentDialoger.rejected.type,
    flyttAktivitet.rejected.type,
];
export const selectHovedsideFeil = createSelector(selectErrors, (errors) => {
    return selectFeil(errors, ...hovedsideFeil);
});

export const selectLagNyAktivitetFeil = createSelector(selectErrors, (errors) => {
    return selectFeil(errors, lagNyAktivitet.rejected.type);
});

export const selectOppdaterAktivitetStatusFeil = createSelector(selectErrors, (errors) => {
    return selectFeil(errors, flyttAktivitet.rejected.type);
});

export const selectOppdaterAktivitetEtikettFeil = createSelector(selectErrors, (errors) => {
    return selectFeil(errors, oppdaterAktivitetEtikett.rejected.type);
});

export const selectOppdaterStillingFraNavSoknadsstatusFeil = createSelector(selectErrors, (errors) => {
    return selectFeil(errors, oppdaterStillingFraNavSoknadsstatus.rejected.type);
});

export const selectDeleCVFeil = createSelector(selectErrors, (errors) => {
    return selectFeil(errors, oppdaterCVSvar.rejected.type);
});

export const selectSettAktivitetTilAvtaltFeil = createSelector(selectErrors, (errors) => {
    return selectFeil(errors, settAktivitetTilAvtalt.rejected.type);
});

export const selectCanPrint = createSelector(selectErrors, (errors) => {
    return selectFeil(errors, hentAktiviteter.rejected.type, hentDialoger.rejected.type).length === 0;
});

export const selectHentMalListeFeil = createSelector(selectErrors, (errors) => {
    return selectFeil(errors, hentMal.rejected.type, hentMalListe.rejected.type);
});

export const selectOppdaterMalFeil = createSelector(selectErrors, (errors) => {
    return selectFeil(errors, oppdaterMal.rejected.type);
});

export const selectPubliserReferatFeil = createSelector(selectErrors, (errors) => {
    return selectFeil(errors, publiserReferat.rejected.type);
});

export const selectPubliserOgOppdaterReferatFeil = createSelector(selectErrors, (errors) => {
    return selectFeil(errors, publiserReferat.rejected.type, oppdaterReferat.rejected.type);
});
