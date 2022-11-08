import { AktivitetStatus } from '../../datatypes/aktivitetTypes';
import { EksternAktivitet, EksternAktivitetData, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { FellesTransaksjonsTyper } from '../../datatypes/transaksjonstyperTypes';

let id = 1003;
let versjon = 4500;

export const enEksternAktivitet = ({
    tittel,
    status,
    avtalt,
    beskrivelse,
    eksternAktivitet,
}: {
    tittel: string;
    status: AktivitetStatus;
    avtalt: boolean;
    beskrivelse: string;
    eksternAktivitet: EksternAktivitetData;
}): EksternAktivitet => {
    id += 1000;
    versjon += 1000;

    return {
        id: `${id}`,
        versjon: `${versjon}`,
        tittel,
        beskrivelse,
        type: VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE,
        status,
        fraDato: '2020-08-21T08:00:00+02:00',
        tilDato: '2022-11-30T12:15:00+02:00',
        opprettetDato: '2018-08-21T11:55:14.044+02:00',
        endretDato: '2018-08-21T11:57:57.636+02:00',
        endretAv: 'z990207',
        historisk: false,
        avsluttetKommentar: undefined,
        avtalt,
        lagtInnAv: 'NAV',
        transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
        etikett: undefined,
        forhaandsorientering: undefined,
        eksternAktivitet,
    };
};
