import { SerializedError } from '../../api/utils';
import { RootState } from '../../store';
import {
    flyttAktivitet,
    hentAktiviteter,
    lagNyAktivitet,
    oppdaterAktivitet,
    oppdaterAktivitetEtikett,
    oppdaterCVSvar,
    oppdaterStillingFraNavSoknadsstatus,
    settAktivitetTilAvtalt,
} from '../aktivitet/aktivitet-actions';
import { hentArenaAktiviteter } from '../aktivitet/arena-aktiviteter-slice';
import { hentDialoger } from '../dialog/dialog-slice';
import { hentIdentitet } from '../identitet/identitet-slice';
import { hentLest } from '../lest/lest-slice';
import { hentOppfolging } from '../oppfolging-status/oppfolging-slice';
import { hentNivaa4 } from '../tilgang/tilgang-slice';

export const selectFeilSlice = (state: RootState) => state.data.errors;

const selectFeil =
    (...types: string[]) =>
    (state: RootState) => {
        return Object.entries(selectFeilSlice(state))
            .filter(([type, _]) => types.includes(type))
            .map(([_, val]) => val);
    };

export const selectHovedsideFeil = (state: RootState) => {
    return selectFeil(
        hentOppfolging.rejected.type,
        hentIdentitet.rejected.type,
        hentAktiviteter.rejected.type,
        hentArenaAktiviteter.rejected.type,
        hentLest.rejected.type,
        hentDialoger.rejected.type,
        hentNivaa4.rejected.type,
        flyttAktivitet.rejected.type
    )(state);
};

export const selectOppdaterAktivitetFeil = (state: RootState) => {
    return selectFeil(oppdaterAktivitet.rejected.type, lagNyAktivitet.rejected.type)(state);
};

export const selectLagNyAktivitetFeil = (state: RootState) => {
    return selectFeil(lagNyAktivitet.rejected.type)(state);
};

export const selectOppdaterAktivitetStatusFeil = (state: RootState) => {
    return selectFeil(flyttAktivitet.rejected.type)(state);
};

export const selectOppdaterAktivitetEtikettFeil = (state: RootState) => {
    return selectFeil(oppdaterAktivitetEtikett.rejected.type)(state);
};

export const selectOppdaterStillingFraNavSoknadsstatusFeil = (state: RootState) => {
    return selectFeil(oppdaterStillingFraNavSoknadsstatus.rejected.type)(state);
};

export const selectDeleCVFeil = (state: RootState) => {
    return selectFeil(oppdaterCVSvar.rejected.type)(state);
};

export const selectSettAktivitetTilAvtaltFeil = (state: RootState) => {
    return selectFeil(settAktivitetTilAvtalt.rejected.type)(state);
};

export const selectCanPrint = (state: RootState) => {
    return selectFeil(hentAktiviteter.rejected.type, hentDialoger.rejected.type)(state).length === 0;
};
