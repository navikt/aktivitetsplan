import { fetureStatus } from './demo/sessionstorage';

export default function (queryParams) {
    if (Array.isArray(queryParams.feature)) {
        return queryParams.feature.reduce((acc, feature) => ({ ...acc, [feature]: fetureStatus(feature) }), {});
    } else {
        return { [queryParams.feature]: fetureStatus(queryParams.feature) };
    }
}
