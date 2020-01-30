import { useSelector } from 'react-redux';
import { selectFeatureData } from './feature-selector';

export const VIS_NY_DIALOG = 'veilarbpersonflatefs.vis_ny_dialog';
export const ALL_FEATURES = [VIS_NY_DIALOG];

export const harFeature = (name: string, features: { [key: string]: boolean }, reverse?: boolean) => {
    return features[name] === !reverse;
};

export const useHarFeature = (name: string, reverse?: boolean): boolean => {
    const features = useSelector(selectFeatureData);
    return harFeature(name, features, reverse);
};
