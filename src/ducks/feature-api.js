import { FEATURE_PATH } from '~config'; // eslint-disable-line
import { fetchToJson } from './../ducks/utils';
import { ALL_FEATURES } from '../felles-komponenter/feature/feature';

const featureQueryParams = features => {
    const reduceFunc = (acc, toggle, i) =>
        `${acc}${i === 0 ? '?' : '&'}feature=${toggle}`;
    return features.reduce(reduceFunc, '');
};

const baseContext = FEATURE_PATH || '';

export function hentFeature(enhet) {
    const features = featureQueryParams(ALL_FEATURES);
    const featuresWithEnhet =
        (features && enhet && `${features}&enhet=${enhet}`) || features;
    return fetchToJson(
        `${baseContext}/api/feature${featuresWithEnhet}`
    ).catch(e => console.log(e));
}

export default {};
