import PT from 'prop-types';

import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
    TILTAK_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from './constant';
import { STATUS } from './ducks/utils';

export const aktivitet = PT.shape({
    tittel: PT.string,
    fraDato: PT.string,
    tilDato: PT.string,
    opprettetDato: PT.string.isRequired,
    endretDato: PT.string,
    historisk: PT.bool,
    lagtInnAv: PT.string,
    detaljer: PT.object,
    beskrivelse: PT.string,
    avtalt: PT.bool,
    tiltaksarrangor: PT.string,
    deltakelsesprosent: PT.number,
    dagerPerUke: PT.number,
});

export const aktiviteter = PT.arrayOf(aktivitet);

export const henvendelse = PT.shape({
    dialogId: PT.string.isRequired,
    tekst: PT.string.isRequired,
    avsender: PT.string.isRequired,
    avsenderId: PT.string,
    sendt: PT.string.isRequired,
    lest: PT.bool.isRequired,
});

export const dialog = PT.shape({
    id: PT.string.isRequired,
    overskrift: PT.string.isRequired,
    aktivitetId: PT.string,
    lest: PT.bool,
    sisteDato: PT.string,
    sisteTekst: PT.string,
    erLestAvBruker: PT.bool,
    venterPaSvar: PT.bool,
    ferdigBehandlet: PT.bool,
    henvendelser: PT.arrayOf(henvendelse).isRequired,
    egenskaper: PT.arrayOf(PT.string),
});

export const etikett = PT.shape({
    id: PT.string,
    type: PT.string,
    visningsTekst: PT.string,
});

export const slice = PT.shape({
    status: PT.string,
    data: PT.any,
});

export const status = PT.oneOf(Object.keys(STATUS));

export const avhengighet = PT.oneOfType([slice, status]);

export const avhengigheter = PT.arrayOf(avhengighet);

export const avslutningStatus = PT.shape({
    kanAvslutte: PT.bool,
    underOppfolging: PT.bool,
    harYtelser: PT.bool,
    harTiltak: PT.bool,
    underKvp: PT.bool,
    inaktiveringsDato: PT.string,
});

export const eskaleringsvarsel = PT.shape({
    varselId: PT.number,
    aktorId: PT.string,
    opprettetAv: PT.string,
    opprettetDato: PT.string,
    avsluttetDato: PT.string,
    tilhorendeDialogId: PT.number,
});

export const oppfolging = PT.shape({
    status: PT.string,
    data: PT.shape({
        fnr: PT.string,
        veileder: PT.string,
        reservasjonKRR: PT.bool,
        manuell: PT.bool,
        underOppfolging: PT.bool,
        oppfolgingUtgang: PT.string,
        gjeldendeEkskaleringsvarsel: eskaleringsvarsel,
        kanStarteOppfolging: PT.bool,
        underKvp: PT.bool,
        avslutningStatus,
        oppfolgingsPerioder: PT.arrayOf(PT.object),
        harSkriveTilgang: PT.bool,
    }),
});

export const mal = PT.shape({
    mal: PT.string,
    endretAv: PT.string,
    dato: PT.string,
});

export const malListe = PT.arrayOf(mal);

export const motpart = PT.shape({
    status: PT.string,
    data: PT.shape({
        navn: PT.string,
    }),
});

export const bruker = PT.shape({
    fodselsnummer: PT.string,
    fornavn: PT.string,
    mellomnavn: PT.string,
    etternavn: PT.string,
    sammensattNavn: PT.string,
});

export const oppfolgingsPeriode = PT.shape({
    id: PT.string,
    fra: PT.string,
    vistFra: PT.string,
    til: PT.string,
});

export const feil = PT.shape({
    type: PT.string,
    httpStatus: PT.number,
    melding: PT.shape({
        id: PT.string,
        type: PT.string.isRequired,
        detaljer: PT.object,
    }),
});

export const veileder = PT.shape({
    etternavn: PT.string,
    fornavn: PT.string,
    ident: PT.string,
    navn: PT.string,
});

export const printMelding = PT.shape({
    overskrift: PT.string,
    beskrivelse: PT.string,
});

export const aktivitettype = PT.oneOf([
    SOKEAVTALE_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
    TILTAK_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    BEHANDLING_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
]);

export const malverktype = PT.shape({
    type: PT.string,
    tittel: PT.string,
    hensikt: PT.string,
    antallStillingerSokes: PT.number,
    avtaleOppfolging: PT.string,
    oppfolging: PT.string,
    beskrivelse: PT.string,
    lenke: PT.string,
    status: PT.string,
    fraDato: PT.string,
    tilDato: PT.string,
});

export const history = PT.shape({
    goBack: PT.func.isRequired,
    push: PT.func.isRequired,
    replace: PT.func.isRequired,
});

export const lest = PT.shape({
    tidspunkt: PT.string.isRequired,
    verdi: PT.string,
    ressurs: PT.string.isRequired,
});
