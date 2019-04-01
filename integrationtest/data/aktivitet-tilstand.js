const AktivitetTilstand = {
    INGEN: 1,
    SOKNADSENDT: 2,
    INNKALT: 3,
    AVSLAG: 4,
    JOBBTILBUD: 5,
    AVTALTMEDNAV: 6,

    properties: {
        1: { value: 'Ingen', selectorId: 'Ingen' },
        2: {
            value: 'Søknaden er sendt',
            selectorId: 'SoknadSendt',
            merkelappId: 'etikett.SOKNAD_SENDT',
        },
        3: {
            value: 'Innkalt til intervju',
            selectorId: 'Innkalt',
            merkelappId: 'etikett.INNKALT_TIL_INTERVJU',
        },
        4: {
            value: 'Fått avslag',
            selectorId: 'Avslag',
            merkelappId: 'etikett.AVSLAG',
        },
        5: {
            value: 'Fått jobbtilbud',
            selectorId: 'Jobbtilbud',
            merkelappId: 'etikett.JOBBTILBUD',
        },
        6: {
            value: 'Avtalt med NAV',
            selectorId: 'Avtalt',
            merkelappId: 'sett-avtalt.label',
        },
    },
};

module.exports = {
    AktivitetTilstand
};
