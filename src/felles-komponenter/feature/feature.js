export const NYENDRINGIAKTIVITET = 'aktivitetsplan.nyendringiaktivitet';
export const NYHOVEDMAAL = 'aktivitetsplan.nyhovedmaal';
export const MANUELL_REGISTRERING = 'modia.manuell_registrering';
export const ALL_FEATURES = [NYENDRINGIAKTIVITET, MANUELL_REGISTRERING, NYHOVEDMAAL];

export const harFeature = (name, features, reverse) => {
    return features[name] === !reverse;
};
