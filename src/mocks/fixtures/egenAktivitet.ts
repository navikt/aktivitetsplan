import { EgenAktivitet, MoteAktivitet, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { AktivitetStatus, Kanal } from '../../datatypes/aktivitetTypes';
import { addDays, subDays } from 'date-fns';
import { FellesTransaksjonsTyper } from '../../datatypes/transaksjonstyperTypes';

export const enEgenAktivitet = ({
    id,
    tittel,
    oppfolgingsperiodeId,
}: {
    id: string;
    tittel: string;
    oppfolgingsperiodeId: string;
}): EgenAktivitet => {
    return {
        id,
        versjon: '9389',
        tittel,
        oppfolgingsperiodeId,
        beskrivelse: 'Beskrivelse av egenaktiviteten',
        type: VeilarbAktivitetType.EGEN_AKTIVITET_TYPE,
        status: AktivitetStatus.PLANLAGT,
        fraDato: subDays(new Date(), 2).toISOString(),
        tilDato: addDays(new Date(), 2).toISOString(),
        opprettetDato: subDays(new Date(), 3).toISOString(),
        endretDato: new Date().toISOString(),
        endretAv: 'z990207',
        historisk: false,
        avtalt: false,
        endretAvType: 'NAV',
        transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
        etikett: undefined,
        lenke: 'www.nav.no',
        avsluttetKommentar: undefined,
        forhaandsorientering: undefined,
    };
};
