import { useSelector } from 'react-redux';

import { selectFeatureData } from './feature-selector';

export const ALL_FEATURES = [];

export const harFeature = (name: string, features: { [key: string]: boolean }, reverse?: boolean) => {
    return features[name] === !reverse;
};

// eslint-disable-next-line
export const useHarFeature = (name: string, reverse?: boolean): boolean => {
    const features = useSelector(selectFeatureData);
    return harFeature(name, features, reverse);
};
