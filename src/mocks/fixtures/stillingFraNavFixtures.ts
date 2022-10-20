import {
    StillingFraNavAktivitet,
    StillingFraNavAktivitetData,
    VeilarbAktivitetType,
} from '../../datatypes/internAktivitetTypes';
import { FellesTransaksjonsTyper } from '../../datatypes/transaksjonstyperTypes';

let id = 1000;
let versjon = 5000000;

export const etTidspunkt = (arstall: number): string => arstall + '-01-31T10:46:25.801+01:00';

export const oddFellow = {
    navn: 'Odd Fellow',
    tittel: 'Daglig leder',
    mobil: '99999999',
};
export const navAnsatt1 = {
    navn: 'Harry Potter',
    tittel: 'NAV-ansatt',
    mobil: '+47 99009900',
};
export const navAnsatt2 = {
    navn: 'Sykfest Strutle',
    tittel: 'NAV-ansatt',
    mobil: null,
};

export const enStillingFraNavAktivitet = ({
    tittel,
    arstall,
}: {
    tittel: string;
    arstall?: number;
}): StillingFraNavAktivitet => {
    const date = arstall ? new Date(etTidspunkt(arstall)) : undefined;
    const opprettet = new Date(etTidspunkt(2020));

    let endretDate = arstall ? new Date(etTidspunkt(arstall)) : undefined;
    endretDate?.setFullYear(endretDate.getFullYear() + 2);
    versjon += 1000;
    id += 1000;

    return {
        avsluttetKommentar: '',
        avtalt: false,
        beskrivelse: '',
        etikett: undefined,
        forhaandsorientering: undefined,
        tilDato: '',
        versjon: `${versjon}`,
        id: `${id}`,
        tittel,
        type: VeilarbAktivitetType.STILLING_FRA_NAV_TYPE,
        status: 'GJENNOMFORES',
        fraDato: date?.toISOString(),
        opprettetDato: opprettet.toISOString(),
        endretDato: endretDate?.toISOString(),
        endretAv: 'z990207',
        historisk: false,
        lagtInnAv: 'NAV',
        transaksjonsType: FellesTransaksjonsTyper.STATUS_ENDRET,
        stillingFraNavData: {
            ...enStillingFraNavData,
            soknadsstatus: 'VENTER',
        },
    };
};
export const jaCvKanDeles = {
    kanDeles: true,
    endretTidspunkt: new Date(),
    endretAv: 'V123',
    endretAvType: 'BRUKER',
};
export const enStillingFraNavData: StillingFraNavAktivitetData = {
    cvKanDelesData: undefined,
    arbeidsgiver: 'Havsalt AS',
    arbeidssted: 'Kristiansand',
    kontaktpersonData: oddFellow,
    soknadsstatus: 'VENTER',
    soknadsfrist: 'Snarest',
    stillingsId: '1231',
    bestillingsId: '12312',
    ikkefattjobbendetaljer: undefined,
    svarfrist: '2022-10-19T14:33:28.518Z',
    livslopsstatus: 'HAR_VARSLET',
};
