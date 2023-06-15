export const VIS_SPRAKSJEKK = 'aktivitetsplan.vis-spraksjekk';

const ALL_TOGGLES = [VIS_SPRAKSJEKK] as const;

export type Feature = (typeof ALL_TOGGLES)[number];
export type Features = Record<Feature, boolean>;

export const toggles = ALL_TOGGLES.map((element: Feature) => 'feature=' + element).join('&');
