import PT from 'prop-types';
import { STATUS } from './ducks/utils';
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

export const aktivitet = PT.shape({
    tittel: PT.string,
    fraDato: PT.string,
    tilDato: PT.string,
    opprettetDato: PT.string.isRequired,
    endretDato: PT.string,
    historisk: PT.bool.isRequired,
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

// deprecated - slice er riktig terminologi
export const reducer = slice;

// deprecated - se over
export const reducerArray = PT.shape({
    status: PT.string,
    data: PT.arrayOf(PT.object),
});

export const status = PT.oneOf(Object.keys(STATUS));

export const avhengigheter = PT.arrayOf(PT.oneOfType([slice, status]));

export const avslutningStatus = PT.shape({
    kanAvslutte: PT.bool,
    underOppfolging: PT.bool,
    harYtelser: PT.bool,
    harTiltak: PT.bool,
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
    brukerHarAvslatt: PT.bool,
    data: PT.shape({
        fnr: PT.string,
        veileder: PT.string,
        reservasjonKRR: PT.bool,
        manuell: PT.bool,
        underOppfolging: PT.bool,
        vilkarMaBesvares: PT.bool,
        oppfolgingUtgang: PT.string,
        gjeldendeEkskaleringsvarsel: eskaleringsvarsel,
        kanStarteOppfolging: PT.bool,
        avslutningStatus,
        oppfolgingsPerioder: PT.arrayOf(PT.object),
    }),
});

export const vilkar = PT.shape({
    tekst: PT.string,
    hash: PT.string,
    dato: PT.string,
    vilkarstatus: PT.string,
    guid: PT.string,
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

export const innstillingHistorikk = PT.shape({
    begrunnelse: PT.string,
    dato: PT.string,
    type: PT.string.isRequired,
    opprettetAvBrukerId: PT.string,
    opprettetAv: PT.string,
    dialogId: PT.number,
});

export const veileder = PT.shape({
    etternavn: PT.string,
    fornavn: PT.string,
    ident: PT.string,
    navn: PT.string,
});

export const arbeidsliste = PT.shape({
    sistEndretAv: PT.shape({
        veilederId: PT.string,
    }),
    endringstidspunkt: PT.string,
    kommentar: PT.string,
    frist: PT.string,
    isOppfolgendeVeileder: PT.bool,
    harVeilederTilgang: PT.bool,
});

const enhet = PT.shape({
    enhetId: PT.string,
    navn: PT.string,
});

export const behandlendeEnheter = PT.shape({
    enheter: PT.arrayOf(enhet),
    status: PT.string,
});

export const veiledere = PT.shape({
    veilederListe: PT.arrayOf(veileder),
    enhet,
    status: PT.string,
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
