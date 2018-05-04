export const AktivitetTilstand = {
    INGEN: 1,
    SOKNADSENDT: 2,
    INNKALT: 3,
    AVSLAG: 4,
    JOBBTILBUD: 5,
    AVTALTMEDNAV: 6,

    properties: {
        1: { value: 'Ingen', selectorId: 'Ingen' },
        2: { value: 'Søknaden er sendt', selectorId: 'SoknadSendt' },
        3: { value: 'Innkalt til intervju', selectorId: 'Innkalt' },
        4: { value: 'Fått avslag', selectorId: 'Avslag' },
        5: { value: 'Fått jobbtilbud', selectorId: 'Jobbtilbud' },
        6: { value: 'Avtalt med NAV', selectorId: 'Avtalt' },
    },
};
