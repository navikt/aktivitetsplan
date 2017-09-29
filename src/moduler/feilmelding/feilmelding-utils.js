const rangering = {
    UKJENT: 1,
    FINNES_IKKE: 1,
    VERSJONSKONFLIKT: 1,
    INGEN_TILGANG: 2,
    UGYLDIG_REQUEST: 3,
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
            const type =
                (feilmelding.melding.data && feilmelding.melding.data.type) ||
                'UKJENT';
            if (rangering[type] < rangering[alvorligste.melding.type]) {
                alvorligste = feilmelding; // eslint-disable-line no-param-reassign
            }
            return alvorligste;
        },
        { melding: { type: 'UGYLDIG_REQUEST' } }
    );
