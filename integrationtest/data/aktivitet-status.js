const AktivitetStatus = {
    FORSLAG: 1,
    PLANLEGGER: 2,
    GJENNOMFORES: 3,
    FULLFORT: 4,
    AVBRUTT: 5,

    properties: {
        1: { value: 'Forslag', selectorId: 'Forslag' },
        2: { value: 'Planlegger', selectorId: 'Planlegger' },
        3: { value: 'Gjennomfører', selectorId: 'Gjennomforer' },
        4: { value: 'Fullført', selectorId: 'Fullfort' },
        5: { value: 'Avbrutt', selectorId: 'Avbrutt' },
    },
};

module.exports = {
    AktivitetStatus
};
