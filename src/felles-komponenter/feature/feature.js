export const NYHOVEDMAAL = 'aktivitetsplan.nyhovedmaal';
export const ALL_FEATURES = [NYHOVEDMAAL];

export const harFeature = (name, features, reverse) => {
    return features[name] === !reverse;
};
