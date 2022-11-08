import { MoteAktivitet, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { FellesTransaksjonsTyper } from '../../datatypes/transaksjonstyperTypes';

export const enMoteAktivitet = (): MoteAktivitet => {
    return {
        id: '6871',
        versjon: '9389',
        tittel: 'Beste møtet ever',
        beskrivelse: 'Vi ønsker å snakke med deg om aktiviteter du har gjennomført og videre oppfølging.',
        type: VeilarbAktivitetType.MOTE_TYPE,
        status: 'PLANLAGT',
        fraDato: '2030-08-21T08:00:00+02:00',
        tilDato: '2030-08-21T12:15:00+02:00',
        opprettetDato: '2018-08-21T11:55:14.044+02:00',
        endretDato: '2018-08-21T11:57:57.636+02:00',
        endretAv: 'z990207',
        historisk: false,
        avtalt: false,
        lagtInnAv: 'NAV',
        forberedelser: 'forberedelser',
        refereat: 'referet',
        transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
        etikett: undefined,
        kanal: 'TELEFON',
        adresse: 'Ditt nærmeste NAV kontor',
        erReferatPublisert: false,
        klokkeslett: '12:22',
        lenke: 'www.nav.no',
        referat: 'Veldig bra møte',
        avsluttetKommentar: undefined,
        forhaandsorientering: undefined,
        varighet: '2 timer',
        filterTags: [],
    } as MoteAktivitet;
};
