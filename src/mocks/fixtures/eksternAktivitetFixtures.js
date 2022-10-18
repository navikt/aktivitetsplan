import { EKSTERN_AKTIVITET_TYPE } from '../../constant';

let id = 1003;
let versjon = 4500;

export function enEksternAktivitet({ tittel, status, beskrivelse, eksternAktivitetData }) {
    id += 1000;
    versjon += 1000;

    return {
        id: `${id}`,
        versjon: `${versjon}`,
        tittel,
        beskrivelse,
        type: EKSTERN_AKTIVITET_TYPE,
        status,
        fraDato: '2020-08-21T08:00:00+02:00',
        tilDato: '2022-10-30T12:15:00+02:00',
        opprettetDato: '2018-08-21T11:55:14.044+02:00',
        endretDato: '2018-08-21T11:57:57.636+02:00',
        endretAv: 'z990207',
        historisk: false,
        avsluttetKommentar: null,
        avtalt: true,
        lagtInnAv: 'NAV',
        transaksjonsType: 'OPPRETTET',
        etikett: null,
        erReferatPublisert: false,
        forhaandsorientering: null,
        eksternAktivitetData,
    };
}
