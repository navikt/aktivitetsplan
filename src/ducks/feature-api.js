import { fetchToJson } from './../ducks/utils';
import { ALL_FEATURES } from '../felles-komponenter/feature/feature';

const featureQueryParams = features => {
    const reduceFunc = (acc, toggle, i) =>
        `${acc}${i === 0 ? '?' : '&'}feature=${toggle}`;
    return features.reduce(reduceFunc, '');
};

export function hentFeature() {
    const features = featureQueryParams(ALL_FEATURES);
    return fetchToJson(
        `/aktivitetsplan/api/feature${features}`
    ).catch(() => {});
    // Ikke gi feilmelding hvis feature feiler, men anta alle features=false
}

export default {};
