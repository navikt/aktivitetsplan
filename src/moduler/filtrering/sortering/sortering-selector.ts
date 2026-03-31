import { RootState } from '../../../store';
import { SorteringState } from './sortering-slice';

export const selectSortering = (state: RootState): SorteringState => state.data.sortering;

