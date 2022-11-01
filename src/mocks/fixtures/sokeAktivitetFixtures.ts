import { SokeavtaleAktivitet, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { FellesTransaksjonsTyper } from '../../datatypes/transaksjonstyperTypes';

let id = 1001;
let versjon = 9001;

export const enSokeAktivitet = ({ tittel }: { tittel: string }): SokeavtaleAktivitet => {
    id += 1000;

    versjon += 1000;

    return {
        id: `${id}`,
        versjon: `${versjon}`,
        tittel,
        beskrivelse:
            'NAV forventer at du søker omtrent 20 stillinger i denne perioden. Det er viktig at du søker på de jobbene du mener du er kvalifisert for. Det er også viktig å søke på mange stillinger, det øker sjansene dine til å finne en jobb. Legg til hver stilling du søker i aktiviteten «En jobb jeg vil søke på».',
        type: VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE,
        status: 'GJENNOMFORES',
        fraDato: '2030-08-21T08:00:00+02:00',
        tilDato: '2020-08-21T12:15:00+02:00',
        opprettetDato: '2018-08-21T11:55:14.044+02:00',
        endretDato: '2018-08-21T11:57:57.636+02:00',
        endretAv: 'z990207',
        historisk: false,
        avtalt: true,
        lagtInnAv: 'NAV',
        transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
        etikett: undefined,
        forhaandsorientering: undefined,
        lenke: undefined,
        filterTags: [],
    };
};
