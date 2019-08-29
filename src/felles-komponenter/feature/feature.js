export const NYHOVEDMAAL = 'aktivitetsplan.nyhovedmaal';
export const STILLINGER_I_UKEN = 'aktivitetsplan.stillingeriuken';
export const ALL_FEATURES = [NYHOVEDMAAL, STILLINGER_I_UKEN];

export const harFeature = (name, features, reverse) => {
    return features[name] === !reverse;
};
