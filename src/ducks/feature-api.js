import { fetchToJson } from './utils';
import { ALL_FEATURES } from '../felles-komponenter/feature/feature';

const featureQueryParams = features => {
    const reduceFunc = (acc, toggle, i) =>
        `${acc}${i === 0 ? '?' : '&'}feature=${toggle}`;
    return features.reduce(reduceFunc, '');
};

export function hentFeature(enhet) {
    const features = featureQueryParams(ALL_FEATURES);
    const featuresWithEnhet =
        (features && enhet && `${features}&enhet=${enhet}`) || features;
    return fetchToJson(
        `${window.appconfig.CONTEXT_PATH}/api/feature${featuresWithEnhet}`
    ).catch(e => console.log(e));
}

export default {};
