export default function(queryParams) {
    if (Array.isArray(queryParams)) {
        return queryParams.feature.reduce(
            (acc, feature) => ({ ...acc, [feature]: true }),
            {}
        );
    } else {
        return { [queryParams.feature]: true };
    }
}
