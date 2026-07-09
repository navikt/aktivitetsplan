declare const brand: unique symbol;

export type Brand<T, TBrand extends string> = T & {
    readonly [brand]: TBrand;
};

export type OppfolgingsPeriodeId = Brand<string, 'OppfolgingsPeriodeId'>;
export type AktivitetsId = Brand<string, 'AktivitetsId'>;
