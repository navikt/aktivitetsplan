import moment from 'moment';
import { rndId } from './utils';
import me from './me';

const aktiviteter = [
    wrapAktivitet({
        id: '1',
        versjon: '693',
        tittel: 'Kaptein sabeltann',
        beskrivelse: 'Vi reiste fra karibien og ankret opp i natt',
        lenke: 'www.nav.no',
        type: 'STILLING',
        status: 'PLANLAGT',
        fraDato: '2018-01-24T12:00:00+01:00',
        tilDato: '2030-01-24T12:00:00+01:00',
        opprettetDato: '2018-01-31T10:46:51.622+01:00',
        endretDato: '2018-09-30T10:46:51.622+01:00',
        endretAv: 'z990207',
        historisk: false,
        avtalt: true,
        arbeidsgiver: 'Sabeltann',
        kontaktperson: 'Sabeltann sin mor',
        arbeidssted: 'Karibien',
        lagtInnAv: 'NAV',
        transaksjonsType: 'AVTALT',
        erReferatPublisert: false,
    }),
    wrapAktivitet({
        id: '2',
        versjon: '691',
        tittel: 'Langemann',
        beskrivelse: 'Ute på åpent hav, er jeg som sabeltanns skygge',
        lenke: 'www.nav.no',
        type: 'STILLING',
        status: 'PLANLAGT',
        fraDato: '2018-01-29T12:00:00+01:00',
        tilDato: '2018-01-30T12:00:00+01:00',
        opprettetDato: '2018-01-31T10:46:24.189+01:00',
        endretDato: '2018-01-31T10:46:25.801+01:00',
        endretAv: 'Z123456',
        historisk: false,
        avtalt: true,
        lagtInnAv: 'NAV',
        transaksjonsType: 'AVTALT',
        etikett: 'SOKNAD_SENDT',
        kontaktperson: 'Sabeltann',
        arbeidsgiver: 'Sabeltann',
        arbeidssted: 'Karibien',
        erReferatPublisert: false,
    }),
    wrapAktivitet({
        id: '5',
        versjon: '2410',
        tittel: 'Ta et webkurs',
        beskrivelse:
            'Jeg skal bli awesome i html. Sjørøvere trenger å være awesome i html',
        lenke: 'www.nav.no',
        type: 'EGEN',
        status: 'BRUKER_ER_INTERESSERT',
        fraDato: '2018-01-01T12:00:00+01:00',
        tilDato: '2018-12-01T12:00:00+01:00',
        opprettetDato: '2018-02-26T15:51:44.197+01:00',
        endretDato: '2018-02-26T15:51:44.85+01:00',
        endretAv: 'Z123456',
        avtalt: false,
        lagtInnAv: 'NAV',
        transaksjonsType: 'STATUS_ENDRET',
        hensikt: 'Lære meg HTML',
        oppfolging: 'Bli en bedre sjørøver',
        erReferatPublisert: false,
    }),
    wrapAktivitet({
        id: '6871',
        versjon: '9389',
        tittel: 'Beste møtet ever',
        beskrivelse:
            'Vi ønsker å snakke med deg om aktiviteter du har gjennomført og videre oppfølging.',
        lenke: null,
        type: 'MOTE',
        status: 'PLANLAGT',
        fraDato: '2018-08-21T08:00:00+02:00',
        tilDato: '2018-08-21T12:15:00+02:00',
        opprettetDato: '2018-08-21T11:55:14.044+02:00',
        endretDato: '2018-08-21T11:57:57.636+02:00',
        endretAv: 'z990207',
        historisk: false,
        avsluttetKommentar: null,
        avtalt: false,
        lagtInnAv: 'NAV',
        transaksjonsType: 'STATUS_ENDRET',
        etikett: null,
        kontaktperson: null,
        arbeidsgiver: null,
        arbeidssted: null,
        stillingsTittel: null,
        hensikt: null,
        oppfolging: null,
        antallStillingerSokes: null,
        avtaleOppfolging: null,
        jobbStatus: null,
        ansettelsesforhold: null,
        arbeidstid: null,
        behandlingType: null,
        behandlingSted: null,
        effekt: null,
        behandlingOppfolging: null,
        kanal: 'TELEFON',
        erReferatPublisert: false,
    }),
];

function valueOrNull(potentialValue) {
    if (potentialValue) {
        return potentialValue;
    }
    return null;
}

function valueOrNow(potentialValue) {
    if (potentialValue) {
        return potentialValue;
    }
    return moment.now().toString();
}

function valueOrFalse(potentialValue) {
    if (potentialValue) {
        return potentialValue;
    }
    return false;
}

function wrapAktivitet(aktivitet) {
    return {
        id: valueOrNull(aktivitet.id),
        versjon: valueOrNull(aktivitet.versjon),
        tittel: valueOrNull(aktivitet.tittel),
        beskrivelse: valueOrNull(aktivitet.beskrivelse),
        lenke: valueOrNull(aktivitet.lenke),
        type: valueOrNull(aktivitet.type),
        status: valueOrNull(aktivitet.status),
        fraDato: valueOrNull(aktivitet.fraDato),
        tilDato: valueOrNull(aktivitet.tilDato),
        opprettetDato: valueOrNull(aktivitet.opprettetDato),
        endretDato: valueOrNull(aktivitet.endretDato),
        endretAv: valueOrNow(aktivitet.endretAv),
        historisk: valueOrFalse(aktivitet.historisk),
        avsluttetKommentar: valueOrNull(aktivitet.avsluttetKommentar),
        avtalt: valueOrFalse(aktivitet.avtalt),
        lagtInnAv: valueOrNull(aktivitet.lagtInnAv),
        transaksjonsType: valueOrNull(aktivitet.transaksjonsType),
        etikett: valueOrNull(aktivitet.etikett),
        kontaktperson: valueOrNull(aktivitet.kontaktperson),
        arbeidsgiver: valueOrNull(aktivitet.arbeidsgiver),
        arbeidssted: valueOrNull(aktivitet.arbeidssted),
        stillingsTittel: valueOrNull(aktivitet.stillingsTittel),
        hensikt: valueOrNull(aktivitet.hensikt),
        oppfolging: valueOrNull(aktivitet.oppfolging),
        antallStillingerSokes: valueOrNull(aktivitet.antallStillingerSokes),
        avtaleOppfolging: valueOrNull(aktivitet.avtaleOppfolging),
        jobbStatus: valueOrNull(aktivitet.jobbStatus),
        ansettelsesforhold: valueOrNull(aktivitet.ansettelsesforhold),
        arbeidstid: valueOrNull(aktivitet.arbeidstid),
        behandlingType: valueOrNull(aktivitet.behandlingType),
        behandlingSted: valueOrNull(aktivitet.behandlingSted),
        effekt: valueOrNull(aktivitet.effekt),
        behandlingOppfolging: valueOrNull(aktivitet.behandlingOppfolging),
        adresse: valueOrNull(aktivitet.adresse),
        forberedelser: valueOrNull(aktivitet.forberedelser),
        kanal: valueOrNull(aktivitet.kanal),
        referat: valueOrNull(aktivitet.referat),
        erReferatPublisert: valueOrFalse(aktivitet.erReferatPublisert),
    };
}

export function getAktivitet(aktivitetId) {
    return aktiviteter.filter(akivitet => akivitet.id === aktivitetId)[0];
}

export function getAktivitetVersjoner(aktivitetId) {
    const aktivitet = getAktivitet(aktivitetId);
    return [
        aktivitet,
        {
            ...aktivitet,
            endretDato: '2017-02-26T15:51:44.85+01:00',
            versjon: '2',
            lagtInnAv: 'BRUKER',
            transaksjonsType: 'OPPRETTET',
        },
    ];
}

export function opprettAktivitet(aktivitet) {
    const newAktivitet = wrapAktivitet({
        id: rndId(),
        opprettetDato: new Date(),
        lagtInnAv: me.erBruker === true ? 'BRUKER' : 'NAV',
        endretDato: moment().toISOString(),
        endretAv: me.id,
        versjon: '1',
        ...aktivitet,
    });
    aktiviteter.push(newAktivitet);
    return newAktivitet;
}

export function oppdaterAktivitet(aktivitetId, aktivitet) {
    const oldAktivitet = aktiviteter.find(
        akivitet => akivitet.id === aktivitetId
    );
    Object.assign(oldAktivitet, aktivitet);
    oldAktivitet.endretDato = moment().toISOString();
    oldAktivitet.endretAv = me.id;
    oldAktivitet.lagtInnAv = me.erBruker === true ? 'BRUKER' : 'NAV';

    return oldAktivitet;
}

export function publiserReferat(aktivitetId) {
    const oldAktivitet = aktiviteter.find(
        akivitet => akivitet.id === aktivitetId
    );
    return { ...oldAktivitet, erReferatPublisert: true };
}

export default {
    aktiviteter,
};
