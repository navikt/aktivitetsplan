export const UKJENT_KATEGORI = 'UKJENT';
export const UGYLDIG_REQUEST_KATEGORI = 'UGYLDIG_REQUEST';
export const FINNES_IKKE_KATEGORI = 'FINNES_IKKE';
export const VERSJONSKONFLIKT_KATEGORI = 'VERSJONSKONFLIKT';
export const INGEN_TILGANG_KATEGORI = 'INGEN_TILGANG';

export const KATEGORI_RANGERING = {
    [UKJENT_KATEGORI]: 1,
    [FINNES_IKKE_KATEGORI]: 1,
    [VERSJONSKONFLIKT_KATEGORI]: 1,
    [INGEN_TILGANG_KATEGORI]: 2,
    [UGYLDIG_REQUEST_KATEGORI]: 3,
};

const splitFeil = feilId => {
    const stack = `${feilId}`.split('-');
    stack.pop();
    return stack.join('-');
};

export const parseFeil = feilId => {
    const result = [];
    let subId = feilId;
    while (subId) {
        result.push(subId);
        subId = splitFeil(subId);
    }
    return result;
};

export const finnHoyesteAlvorlighetsgrad = feilmeldinger =>
    feilmeldinger.reduce(
        (alvorligste, feilmelding) => {
            const data = feilmelding.melding.data;
            const type = (data && data.type) || UKJENT_KATEGORI;
            if (
                KATEGORI_RANGERING[type] <
                KATEGORI_RANGERING[alvorligste.melding.type]
            ) {
                alvorligste = feilmelding; // eslint-disable-line no-param-reassign
            }
            return alvorligste;
        },
        { melding: { type: UGYLDIG_REQUEST_KATEGORI } }
    );
