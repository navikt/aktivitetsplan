import { useSelector } from 'react-redux';

import { selectFeatureData } from './feature-selector';

//Ikke støte i pto-fronted for feature togles per nå. (11.11.21)
export const ALL_FEATURES = [];

export const harFeature = (name: string, features: { [key: string]: boolean }, reverse?: boolean) => {
    return features[name] === !reverse;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useHarFeature = (name: string, reverse?: boolean): boolean => {
    const features = useSelector(selectFeatureData);
    return harFeature(name, features, reverse);
};
