export const arbeidsliste = {
    sistEndretAv: {
        veilederId: 'Z123456',
    },
    endringstidspunkt: '2018-04-04T14:25:45.882Z',
    kommentar: 'Pirat virksomhet er vanskelig',
    frist: '2020-04-05T10:00:00Z',
    isOppfolgendeVeileder: true,
    arbeidslisteAktiv: null,
    harVeilederTilgang: true,
};

export function FjernArbeidsliste() {
    arbeidsliste.sistEndretAv = null;
    arbeidsliste.endringstidspunkt = null;
    arbeidsliste.kommentar = null;
    arbeidsliste.frist = null;
    arbeidsliste.arbeidslisteAktiv = null;

    return arbeidsliste;
}

export function PutArbeidsliste(body) {
    arbeidsliste.sistEndretAv = { veilederId: 'Z123456' };
    arbeidsliste.endringstidspunkt = new Date();

    arbeidsliste.kommentar = body.kommentar;
    arbeidsliste.frist = body.frist;

    return arbeidsliste;
}
