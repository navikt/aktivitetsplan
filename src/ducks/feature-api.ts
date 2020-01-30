import { fetchToJson } from './utils';
import { ALL_FEATURES } from '../felles-komponenter/feature/feature';

const featureQueryParams = (features: string[]) => {
    const reduceFunc = (acc: string, toggle: string, i: number) => `${acc}${i === 0 ? '?' : '&'}feature=${toggle}`;
    return features.reduce(reduceFunc, '');
};

export function hentFeature(enhet?: string): { [key: string]: boolean } {
    const features = featureQueryParams(ALL_FEATURES);

    if (features.length === 0) {
        return {};
    }

    // @ts-ignore
    const path: string = window.appconfig.CONTEXT_PATH;
    const featuresWithEnhet = (features && enhet && `${features}&enhet=${enhet}`) || features;
    return fetchToJson(`${path}/api/feature${featuresWithEnhet}`);
}

export default {};
