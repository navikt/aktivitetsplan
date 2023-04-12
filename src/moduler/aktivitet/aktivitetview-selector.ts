import { RootState } from '../../store';

export const selectAktiviteterSomHarBlittVist = (state: RootState) => state.view.visteAktiviteterMedEndringer.data;

export const selectSistVisteAktivitet = (state: RootState) => {
    const aktiviteter = selectAktiviteterSomHarBlittVist(state);
    return aktiviteter.length === 0 ? aktiviteter[aktiviteter.length - 1] : undefined;
};
