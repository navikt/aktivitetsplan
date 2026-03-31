import { RootState } from '../../../store';
import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import { defaultSortering, KolonneSorteringState, SorteringState } from './sortering-slice';

export const selectKolonneSortering = (state: RootState): KolonneSorteringState => state.data.sortering;

export const selectSorteringForKolonne =
    (status: AktivitetStatus) =>
    (state: RootState): SorteringState =>
        state.data.sortering[status] ?? defaultSortering;
