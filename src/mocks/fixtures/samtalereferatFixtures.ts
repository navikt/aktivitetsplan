import { SamtalereferatAktivitet, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { FellesTransaksjonsTyper } from '../../datatypes/transaksjonstyperTypes';

let id = 1002;
let versjon = 1002;

export const etSamtalereferat = ({ tittel }: { tittel: string }): SamtalereferatAktivitet => {
    id += 1000;
    versjon += 1000;

    return {
        id: `${id}`,
        versjon: `${versjon}`,
        tittel,
        referat: 'Dette er et referat\n\nMed flere avsnitt.\nOg linjeskift.',
        avtalt: false,
        endretAv: '1602677081175',
        endretDato: '2020-10-14T12:04:41.175Z',
        erReferatPublisert: true,
        fraDato: '2020-10-14T12:04:33.649Z',
        historisk: false,
        kanal: 'TELEFON',
        lagtInnAv: 'NAV',
        opprettetDato: '2020-10-14T12:04:41.175Z',
        status: 'GJENNOMFORES',
        transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
        type: VeilarbAktivitetType.SAMTALEREFERAT_TYPE,
        filterTags: [],
        adresse: 'adresse',
        beskrivelse: 'beskrivelse',
        forberedelser: 'forberedelser',
        varighet: 'varighet',
    };
};
