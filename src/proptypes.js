import { PropTypes as PT } from 'react';

export const aktivitet = PT.shape({
    tittel: PT.string,
    fraDato: PT.number,
    tilDato: PT.number,
    opprettetDato: PT.number,
    detaljer: PT.object,
    beskrivelse: PT.string
});

export const etikett = PT.shape({
    id: PT.string,
    type: PT.string,
    visningsTekst: PT.string
});

export const endringslogg = PT.shape({
    endringsBeskrivelse: PT.string,
    endretAv: PT.string,
    endretDato: PT.number
});

export const oppfolgingStatus = PT.shape({
    status: PT.string.isRequired,
    data: PT.object
});

export const vilkar = PT.shape({
    text: PT.string,
    hash: PT.string
});

export const mal = PT.shape({
    mal: PT.string,
    endretAv: PT.string,
    dato: PT.number
});
