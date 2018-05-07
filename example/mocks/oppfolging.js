import { EKSEMPEL_VEILEDER } from '../config';

let oppfolging = {
    fnr: null,
    veilederId: null,
    reservasjonKRR: false,
    manuell: false,
    underOppfolging: true,
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
            startDato: '2018-01-31T10:46:10.971+01:00',
            sluttDato: null,
            begrunnelse: null,
        },
    ],
    harSkriveTilgang: true,
};

export default function(queryParams) {
    const { fnr } = queryParams;
    oppfolging.fnr = fnr;
    return oppfolging;
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
