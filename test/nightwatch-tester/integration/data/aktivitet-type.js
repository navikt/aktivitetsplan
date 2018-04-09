export const AktivitetsType = {
    STILLING: 1,
    MOTE: 2,
    EGENAKTIVITET: 3,
    AVTALE: 4,
    MEDISINSKBEHANDLING: 5,
    SAMTALEREFERAT: 6,
    JOBBJEGHAR: 7,

    properties: {
        1: { value: 'Stilling jeg skal søke', oversiktNavn: 'STILLING' },
        2: { value: 'Møte med NAV', oversiktNavn: 'MØTE MED NAV' },
        3: {
            value: 'Jobbrettet egenaktivitet',
            oversiktNavn: 'JOBBRETTET EGENAKTIVITET',
        },
        4: { value: 'Avtale om å søke jobber', oversiktNavn: 'JOBBSØKING' },
        5: { value: 'Medisinsk behandling', oversiktNavn: 'BEHANDLING' },
        6: { value: 'Samtalereferat' },
        7: { value: 'Jobb jeg har nå', oversiktNavn: 'JOBB JEG HAR NÅ' },
    },
};
