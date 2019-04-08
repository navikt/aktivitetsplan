const AktivitetsType = {
    STILLING: 1,
    MOTE: 2,
    EGENAKTIVITET: 3,
    AVTALE: 4,
    MEDISINSKBEHANDLING: 5,
    SAMTALEREFERAT: 6,
    JOBBJEGHAR: 7,
    ARENA: 8,

    properties: {
        1: { value: 'Stilling jeg skal søke', testId: 'STILLING' },
        2: { value: 'Møte med NAV', testId: 'MOTE' },
        3: {
            value: 'Jobbrettet egenaktivitet',
            testId: 'EGEN',
        },
        4: { value: 'Avtale om å søke jobber', testId: 'SOKEAVTALE' },
        5: { value: 'Medisinsk behandling', testId: 'BEHANDLING' },
        6: { value: 'Samtalereferat', testId: 'SAMTALEREFERAT' },
        7: { value: 'Jobb jeg har nå', testId: 'IJOBB' },
        8: { value: '', testId: 'TILTAKSAKTIVITET' },
    },
};

module.exports = {
    AktivitetsType
};
