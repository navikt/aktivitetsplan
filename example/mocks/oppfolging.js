import { EKSEMPEL_VEILEDER } from '../config';

const oppfolging = {
    fnr: null,
    veilederId: null,
    reservasjonKRR: false,
    manuell: false,
    underOppfolging: false,
    underKvp: false,
    vilkarMaBesvares: false,
    oppfolgingUtgang: null,
    gjeldendeEskaleringsvarsel: null,
    kanStarteOppfolging: false,
    avslutningStatus: null,
    oppfolgingsPerioder: [
        {
            aktorId: '1234567988888',
            veileder: null,
            startDato: '2018-01-30T10:46:10.971+01:00',
            sluttDato: '2018-01-31T10:46:10.971+01:00',
            begrunnelse: null,
        },
        {
            aktorId: '1234567988888',
            veileder: null,
            startDato: '2018-01-31T10:46:10.971+01:00',
            sluttDato: null,
            begrunnelse: null,
        },
    ],
    harSkriveTilgang: true,
    kanReaktiveres: false,
    inaktiveringsdato: '2018-08-31T10:46:10.971+01:00',
};

export default function(queryParams, changeFn = ob => ob) {
    const { fnr } = queryParams;
    oppfolging.fnr = fnr;
    return changeFn(oppfolging);
}

export function startEskalering(update) {
    oppfolging.gjeldendeEskaleringsvarsel = {
        aktorId: '1234567988888',
        avsluttetDato: null,
        opprettetAv: EKSEMPEL_VEILEDER,
        opprettetDato: new Date(),
        tilhorendeDialogId: parseInt(update.dialogId),
        varselId: 1,
    };
    return {};
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
