export const VIS_NY_DIALOG = 'veilarbpersonflatefs.vis_ny_dialog';
export const ALL_FEATURES = [VIS_NY_DIALOG];

export const harFeature = (name: string, features: { [key: string]: boolean }, reverse?: boolean) => {
    return features[name] === !reverse;
};
