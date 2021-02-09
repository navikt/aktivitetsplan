import { useSelector } from 'react-redux';

import { selectFeatureData } from './feature-selector';

const nyForaandsorientering = 'aktivitetsplan.ny.forhaandsorientering';
const medisinskBehandlingAvBruker = 'aktivitetsplan.medisinsk.behandling.bruker';

export const ALL_FEATURES = [nyForaandsorientering, medisinskBehandlingAvBruker];

export const harFeature = (name: string, features: { [key: string]: boolean }, reverse?: boolean) => {
    return features[name] === !reverse;
};

const useHarFeature = (name: string, reverse?: boolean): boolean => {
    const features = useSelector(selectFeatureData);
    return harFeature(name, features, reverse);
};

export const useSkalBrukeNyForhaandsorientering = () => useHarFeature(nyForaandsorientering);

export const useSkalBrukeMedisinskBehandlingAvBruker = () => useHarFeature(medisinskBehandlingAvBruker);
