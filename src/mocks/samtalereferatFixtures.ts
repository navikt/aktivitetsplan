import { AktivitetStatus, Kanal } from '../datatypes/aktivitetTypes';
import { SamtalereferatAktivitet, VeilarbAktivitetType } from '../datatypes/internAktivitetTypes';
import { FellesTransaksjonsTyper } from '../datatypes/transaksjonstyperTypes';

let id = 1002;
let versjon = 1002;

export function etSamtalereferat({ tittel }: { tittel: string }): SamtalereferatAktivitet {
    id += 1000;
    versjon += 1000;

    return {
        id: `${id}`,
        versjon: `${versjon}`,
        tittel,
        referat:
            'Dette er et referat\n\nMed flere avsnitt.\nOg linjeskift. https://www.nav.no asdasdasdads 123 https://www.google.com',
        avtalt: false,
        endretAv: '1602677081175',
        endretDato: '2020-10-14T12:04:41.175Z',
        erReferatPublisert: true,
        fraDato: '2020-10-14T12:04:33.649Z',
        historisk: false,
        kanal: Kanal.TELEFON,
        endretAvType: 'NAV',
        opprettetDato: '2020-10-14T12:04:41.175Z',
        status: AktivitetStatus.GJENNOMFOERT,
        transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
        type: VeilarbAktivitetType.SAMTALEREFERAT_TYPE,
    };
}
