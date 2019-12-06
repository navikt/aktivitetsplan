export const ALL_FEATURES = [];

export const harFeature = (name, features, reverse) => {
    return features[name] === !reverse;
};
