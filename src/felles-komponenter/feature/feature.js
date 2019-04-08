export const NYENDRINGIAKTIVITET = 'aktivitetsplan.nyendringiaktivitet';
export const MANUELL_REGISTRERING = 'modia.manuell_registrering';
export const ALL_FEATURES = [NYENDRINGIAKTIVITET, MANUELL_REGISTRERING];

export const harFeature = (name, features, reverse) => {
    return features[name] === !reverse;
};
