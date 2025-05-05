const ALL_TOGGLES = ['aktivitetsplan.tryggtekst'] as const;

export type Feature = (typeof ALL_TOGGLES)[number];
export type Features = Record<Feature, boolean>;

export const toggles = ALL_TOGGLES.map((element: Feature) => 'feature=' + element).join('&');
