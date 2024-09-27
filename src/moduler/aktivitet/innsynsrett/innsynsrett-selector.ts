import { RootState } from '../../../store';

export const selectInnsynsrett = (state: RootState) => {
    return state.data.innsynsrett;
};
