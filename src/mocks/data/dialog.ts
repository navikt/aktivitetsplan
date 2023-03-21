import { ResponseComposition, RestContext, RestRequest } from 'msw';

import { erEksternBruker, ulesteDialoger } from '../demo/sessionstorage';
import { rndId } from '../utils';

const dialoger = [
    {
        id: '1',
        aktivitetId: '1',
        overskrift: 'NOT USED',
        sisteTekst: 'Hei. Hva er status her? Har du finnet Kaptain Sabeltann?',
        sisteDato: '2018-01-28T12:48:56.097+01:00',
        opprettetDato: '2018-02-27T12:48:56.081+01:00',
        historisk: false,
        lest: !ulesteDialoger(),
        venterPaSvar: false,
        ferdigBehandlet: false,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        henvendelser: [
            {
                id: '1',
                dialogId: '1',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2018-02-27T12:48:56.097+01:00',
                lest: !ulesteDialoger(),
                tekst: 'Hei. Hva er status her? Har du finnet Kaptain Sabeltann?',
            },
            {
                id: '2',
                dialogId: '1',
                avsender: 'BRUKER',
                avsenderId: '0102030405',
                sendt: '2018-02-28T12:48:56.097+01:00',
                lest: !ulesteDialoger(),
                tekst: 'Hei. Leter enda på sjøen :)',
            },
        ],
        egenskaper: [],
    },
    {
        id: '3',
        aktivitetId: '141439',
        overskrift: 'NOT USED',
        sisteTekst:
            'Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ber vi deg ta kontakt med veilederen din så snart som mulig.',
        sisteDato: '2018-11-21T13:13:20.685+01:00',
        opprettetDato: '2018-11-21T13:13:20.663+01:00',
        historisk: false,
        lest: !ulesteDialoger(),
        venterPaSvar: false,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        henvendelser: [
            {
                id: '4',
                dialogId: '141439',
                avsender: 'VEILEDER',
                avsenderId: 'Z990286',
                sendt: '2018-11-21T13:13:20.685+01:00',
                lest: !ulesteDialoger(),
                tekst: 'Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ber vi deg ta kontakt med veilederen din så snart som mulig.',
            },
        ],
        egenskaper: ['PARAGRAF8'],
    },
    {
        id: '2',
        aktivitetId: null,
        overskrift: 'Du har fått et varsel fra NAV',
        sisteTekst: 'Jeg har ikke hørt noe fra deg i det siste. Har du forlist?\n',
        sisteDato: '2018-02-01T11:52:20.615+01:00',
        opprettetDato: '2018-02-01T11:52:20.535+01:00',
        historisk: false,
        lest: !ulesteDialoger(),
        venterPaSvar: true,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        henvendelser: [
            {
                id: '3',
                dialogId: '2',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2018-02-01T11:52:20.615+01:00',
                lest: !ulesteDialoger(),
                tekst: 'Jeg har ikke hørt noe fra deg i det siste. Har du forlist?\n',
            },
        ],
        egenskaper: ['ESKALERINGSVARSEL'],
    },
    {
        id: '4',
        aktivitetId: null,
        overskrift: 'Automatiske dialoger',
        sisteTekst:
            'Hei!\n' +
            'Du er registrert som arbeidssøker og NAV trenger å bli kjent med ditt behov for hjelp fra oss, slik at vi kan gi deg riktig veiledning.\n' +
            'Hva mener du? Klik her og vurder hva du selv tenker https://behovsvurdering.nav.no\n',
        sisteDato: '2018-01-28T12:48:56.097+01:00',
        opprettetDato: '2018-02-27T12:48:56.081+01:00',
        historisk: false,
        lest: !ulesteDialoger(),
        venterPaSvar: false,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: '2018-02-27T12:48:57.097+01:00',
        erLestAvBruker: true,
        henvendelser: [
            {
                id: '4',
                dialogId: '4',
                avsender: 'VEILEDER',
                avsenderId: null,
                sendt: '2018-02-27T12:48:56.097+01:00',
                lest: !ulesteDialoger(),
                tekst:
                    'Hei!\n' +
                    'Du er registrert som arbeidssøker og NAV trenger å bli kjent med ditt behov for hjelp fra oss, slik at vi kan gi deg riktig veiledning.\n' +
                    'Hva mener du? Klik her og vurder hva du selv tenker https://behovsvurdering.nav.no\n',
            },
            {
                id: '5',
                dialogId: '4',
                avsender: 'VEILEDER',
                avsenderId: null,
                sendt: '2018-02-28T12:48:56.097+01:00',
                lest: !ulesteDialoger(),
                tekst:
                    'Hei!\n' +
                    'Du har svart at du har utfordringer som hindrer deg i å søke eller være i jobb. Vi vil veilede deg videre og trenger derfor å vite litt mer.\n' +
                    'Du kan velge om du vil fortelle om situasjonen din \n' +
                    '- i et møte med veilederen din på NAV-kontoret\n' +
                    '- i en telefonsamtale\n' +
                    '- her i dialogen\n' +
                    'Skriv svaret ditt i feltet over. Hvis du velger "her i dialogen", kan du fortelle mer allerede nå.\n',
            },
            {
                id: '6',
                dialogId: '4',
                avsender: 'VEILEDER',
                avsenderId: null,
                sendt: '2018-02-28T12:48:56.097+01:00',
                lest: !ulesteDialoger(),
                tekst:
                    'Hei!\n' +
                    'Du har svart at du trenger mer veiledning nå som retten til sykepenger nærmer seg slutten. Vi vil veilede deg videre og trenger derfor å vite litt mer.\n' +
                    'Du kan velge om du vil fortelle om situasjonen din \n' +
                    '- i et møte med veilederen din på NAV-kontoret\n' +
                    '- i en telefonsamtale\n' +
                    '- her i dialogen\n' +
                    'Skriv svaret ditt i feltet over. Hvis du velger "her i dialogen", kan du fortelle mer allerede nå.\n',
            },
        ],
        egenskaper: [],
    },
    {
        id: '2',
        aktivitetId: '10',
        overskrift: 'Du har fått et varsel fra NAV',
        sisteTekst: 'Jeg har ikke hørt noe fra deg i det siste. Har du forlist?\n',
        sisteDato: '2017-02-17T12:52:20.615+01:00',
        opprettetDato: '2017-02-17T11:52:20.535+01:00',
        historisk: false,
        lest: !ulesteDialoger(),
        venterPaSvar: true,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        henvendelser: [
            {
                id: '3',
                dialogId: '2',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2017-02-17T11:52:20.535+01:00',
                lest: !ulesteDialoger(),
                tekst: 'Jeg har ikke hørt noe fra deg i det siste. Har du forlist?\n',
            },
            {
                id: '3',
                dialogId: '2',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2017-02-17T11:52:20.535+01:00',
                lest: !ulesteDialoger(),
                tekst: 'Fortsat ikke hørt noe. Har du forlist?\n',
            },
        ],
        egenskaper: [],
    },
];

export const opprettDialog = async (req: RestRequest) => {
    const body = await req.json();

    const dialogId = body.dialogId === undefined ? rndId() : `${body.dialogId}`;
    const nyHenvendelse = {
        id: rndId(),
        dialogId: dialogId,
        avsender: erEksternBruker() ? 'BRUKER' : 'VEILEDER',
        avsenderId: 'Z123456',
        overskrift: body.overskrift,
        tekst: body.tekst,
        lest: !ulesteDialoger(),
        sendt: new Date(),
    } as any;

    const eksisterendeDialoger = dialoger.filter((dialog) => body.dialogId !== undefined && dialog.id === dialogId);

    if (eksisterendeDialoger.length === 1) {
        const oldDialog = eksisterendeDialoger[0];
        oldDialog.sisteTekst = body.tekst;
        oldDialog.sisteDato = nyHenvendelse.sendt;
        oldDialog.henvendelser.push(nyHenvendelse);
        return oldDialog;
    } else {
        const nyDialog = {
            id: nyHenvendelse.dialogId,
            ferdigBehandlet: !body.ikkeFerdigbehandlet,
            venterPaSvar: !!body.venterPaSvar,
            aktivitetId: body.aktivitetId === undefined ? null : body.aktivitetId,
            overskrift: body.overskrift,
            sisteTekst: body.tekst,
            sisteDato: new Date(),
            opprettetDato: new Date(),
            historisk: false,
            lest: !ulesteDialoger(),
            lestAvBrukerTidspunkt: null,
            erLestAvBruker: false,
            henvendelser: [nyHenvendelse],
            egenskaper: body.egenskaper === undefined ? [] : body.egenskaper,
        } as any;
        dialoger.push(nyDialog);
        return nyDialog;
    }
};

export function setVenterPaaSvar(req: RestRequest, _res: ResponseComposition, _ctx: RestContext) {
    const dialog = dialoger.filter((d) => d.id === req.params.id)[0];
    dialog.venterPaSvar = req.params.bool === 'true';
    return dialog;
}

export function setFerdigBehandlet(req: RestRequest, _res: ResponseComposition, _ctx: RestContext) {
    const dialog = dialoger.filter((d) => d.id === req.params.id)[0];
    dialog.ferdigBehandlet = req.params.bool === 'true';
    return dialog;
}

export default dialoger;
