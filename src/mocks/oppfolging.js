import {
    erEskalertBruker,
    erKRRBruker,
    erManuellBruker,
    erPrivatBruker,
    ingenOppfPerioder,
} from './demo/sessionstorage';

const oppfPerioder = [
    {
        aktorId: '1234567988888',
        veileder: null,
        startDato: '2017-01-30T10:46:10.971+01:00',
        sluttDato: '2017-12-31T10:46:10.971+01:00',
        begrunnelse: null,
        kvpPerioder: [
            {
                aktorId: '1234567988888',
                enhet: 'Z134',
                opprettetAv: 'ZOO',
                opprettetDato: '2017-01-30T10:46:10.971+01:00',
                opprettetBegrunnelse: 'Vet ikke helt',
                opprettetKodeVerkbruker: 'NAV',
                avsluttetAV: 'ZOO',
                avsluttetDato: '2017-12-01T10:46:10.971+01:00',
                avsluttetBegrunnelse: 'vet ikke',
                avsluttetKodeverkbruker: 'NAV',
            },
            {
                aktorId: '1234567988888',
                enhet: 'Z134',
                opprettetAv: 'ZOO',
                opprettetDato: '2017-12-01T10:46:10.971+01:00',
                opprettetBegrunnelse: 'Vet ikke helt',
                opprettetKodeVerkbruker: 'NAV',
                avsluttetAV: 'ZOO',
                avsluttetDato: '2017-12-02T10:46:10.971+01:00',
                avsluttetBegrunnelse: 'vet ikke',
                avsluttetKodeverkbruker: 'NAV',
            },
        ],
    },
    {
        aktorId: '1234567988888',
        veileder: null,
        startDato: '2018-01-31T10:46:10.971+01:00',
        sluttDato: null,
        begrunnelse: null,
    },
];

const oppfolging = {
    fnr: null,
    aktorId: '1234567988888',
    veilederId: null,
    reservasjonKRR: erKRRBruker(),
    manuell: erManuellBruker(),
    underOppfolging: !erPrivatBruker(),
    underKvp: false,
    oppfolgingUtgang: null,
    gjeldendeEskaleringsvarsel: erEskalertBruker()
        ? {
              tilhorendeDialogId: 2,
          }
        : null,
    kanStarteOppfolging: false,
    avslutningStatus: null,
    oppfolgingsPerioder: ingenOppfPerioder() ? [] : oppfPerioder,
    harSkriveTilgang: true,
    kanReaktiveres: false,
    servicegruppe: 'IVURD',
    inaktiveringsdato: '2018-08-31T10:46:10.971+01:00',
};

export default function (queryParams, changeFn = (ob) => ob) {
    const { fnr } = queryParams;
    oppfolging.fnr = fnr;
    return changeFn(oppfolging);
}

export function startEskalering(update) {
    oppfolging.gjeldendeEskaleringsvarsel = {
        aktorId: '1234567988888',
        avsluttetDato: null,
        opprettetAv: 'Z123456',
        opprettetDato: new Date(),
        tilhorendeDialogId: parseInt(update.dialogId),
        varselId: 1,
    };
    return {};
}

export function settDigital() {
    oppfolging.manuell = false;
    return oppfolging;
}

export function stoppEskalering(update) {
    oppfolging.gjeldendeEskaleringsvarsel = null;
    return {};
}

export function avslutningStatus(update) {
    oppfolging.avslutningStatus = {
        kanAvslutte: true,
        underOppfolging: false,
        harYtelser: true,
        harTiltak: true,
        underKvp: false,
        inaktiveringsDato: '2018-06-05T00:00:00+02:00',
    };
    return oppfolging;
}
