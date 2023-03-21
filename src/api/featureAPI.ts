import { fetchToJson } from './utils';

const featureQueryParams = (features: string[]) => {
    const reduceFunc = (acc: string, toggle: string, i: number) => `${acc}${i === 0 ? '?' : '&'}feature=${toggle}`;
    return features.reduce(reduceFunc, '');
};

export function hentFeature(enhet?: string): Promise<{ [key: string]: boolean }> {
    const features = featureQueryParams([]);

    if (features.length === 0) {
        return Promise.resolve({ ignore: false });
    }

    const path: string = window.appconfig.CONTEXT_PATH;
    const featuresWithEnhet = (features && enhet && `${features}&enhet=${enhet}`) || features;
    return fetchToJson(`${path}/api/feature${featuresWithEnhet}`);
}
