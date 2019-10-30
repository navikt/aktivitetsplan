export const NYHOVEDMAAL = 'aktivitetsplan.nyhovedmaal';
export const ABMAL = 'aktivitetsplan.abmal';
export const ALL_FEATURES = [NYHOVEDMAAL, ABMAL];

export const harFeature = (name, features, reverse) => {
    return features[name] === !reverse;
};
