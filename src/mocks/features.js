import { featureStatus } from './demo/sessionstorage';

export default function getFeatures(queryParams) {
    if (Array.isArray(queryParams.feature)) {
        return queryParams.feature.reduce((acc, feature) => ({ ...acc, [feature]: featureStatus(feature) }), {});
    } else {
        return { [queryParams.feature]: featureStatus(queryParams.feature) };
    }
}
