import { rndId } from './utils';

const dialoger = [
    {
        id: '1',
        aktivitetId: '1',
        overskrift: 'NOT USED',
        sisteTekst: 'Hei. Hva er status her? Har du finnet Kaptain Sabeltann?',
        sisteDato: '2018-01-28T12:48:56.097+01:00',
        opprettetDato: '2018-02-27T12:48:56.081+01:00',
        historisk: false,
        lest: true,
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
                lest: true,
                tekst:
                    'Hei. Hva er status her? Har du finnet Kaptain Sabeltann?',
            },
            {
                id: '2',
                dialogId: '1',
                avsender: 'BRUKER',
                avsenderId: '0102030405',
                sendt: '2018-02-28T12:48:56.097+01:00',
                lest: true,
                tekst: 'Hei. Leter enda på sjøen :)',
            },
        ],
        egenskaper: [],
    },
    {
        id: '2',
        aktivitetId: null,
        overskrift: 'Du har fått et varsel fra NAV',
        sisteTekst:
            'Jeg har ikke hørt noe fra deg i det siste. Har du forlist?\n',
        sisteDato: '2018-02-01T11:52:20.615+01:00',
        opprettetDato: '2018-02-01T11:52:20.535+01:00',
        historisk: false,
        lest: true,
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
                lest: true,
                tekst:
                    'Jeg har ikke hørt noe fra deg i det siste. Har du forlist?\n',
            },
        ],
        egenskaper: ['ESKALERINGSVARSEL'],
    },
];

export function opprettDialog(update) {
    const dialogId =
        update.dialogId === undefined ? rndId() : `${update.dialogId}`;
    const nyHenvendelse = {
        id: rndId(),
        dialogId: dialogId,
        avsender: 'VEILEDER',
        avsenderId: 'Z123456',
        overskrift: update.overskrift,
        tekst: update.tekst,
        lest: true,
        sendt: new Date(),
    };

    const eksisterendeDialoger = dialoger.filter(
        dialog => update.dialogId !== undefined && dialog.id === dialogId
    );

    if (eksisterendeDialoger.length === 1) {
        const oldDialog = eksisterendeDialoger[0];
        oldDialog.sisteTekst = update.tekst;
        oldDialog.sisteDato = nyHenvendelse.sendt;
        oldDialog.henvendelser.push(nyHenvendelse);
        return oldDialog;
    } else {
        const nyDialog = {
            id: nyHenvendelse.dialogId,
            ferdigBehandlet: !update.ikkeFerdigbehandlet,
            venterPaSvar: !!update.venterPaSvar,
            aktivitetId:
                update.aktivitetId === undefined ? null : update.aktivitetId,
            overskrift: update.overskrift,
            sisteTekst: update.tekst,
            sisteDato: new Date(),
            opprettetDato: new Date(),
            historisk: false,
            lest: true,
            lestAvBrukerTidspunkt: null,
            erLestAvBruker: false,
            henvendelser: [nyHenvendelse],
            egenskaper:
                update.egenskaper === undefined ? [] : update.egenskaper,
        };
        dialoger.push(nyDialog);
        return nyDialog;
    }
}

export function setVenterPaSvar(id, bool) {
    const dialog = dialoger.filter(dialog => dialog.id === id)[0];
    dialog.venterPaSvar = bool === 'true';
    return dialog;
}
export function setFerdigBehandlet(id, bool) {
    const dialog = dialoger.filter(dialog => dialog.id === id)[0];
    dialog.ferdigBehandlet = bool === 'true';
    return dialog;
}

export default dialoger;
