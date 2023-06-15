import { RootState } from '../../store';
import { Feature, Features } from './feature';

const selectFeatureSlice = (state: RootState) => state.data.feature;

const selectFeatureData = (state: RootState) => selectFeatureSlice(state).data as Features;

export const selectFeature = (feature: Feature) => (state: RootState) => {
    return selectFeatureData(state)[feature];
};
