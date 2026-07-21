import { RootState } from '../../../store/rootReducer';

export const selectInnsynsrett = (state: RootState) => {
    return state.data.innsynsrett.data;
};
