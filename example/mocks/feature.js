export default function(queryParams) {
    return queryParams.feature.reduce(
        (acc, feature) => ({ ...acc, [feature]: true }),
        {}
    );
}
