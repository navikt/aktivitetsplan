import moment from 'moment';

import { erEksternBruker, visAutomatiskeAktiviteter, visTestAktiviteter } from './demo/sessionstorage';
import { rndId } from './utils';

const eksternBruker = erEksternBruker();
const bruker = eksternBruker ? 'BRUKER' : 'NAV';

const testAktiviteter = !visTestAktiviteter()
    ? []
    : [
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
              avtalt: false,
              arbeidsgiver: 'Skipet AS',
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
              status: 'GJENNOMFORES',
              fraDato: '2018-01-29T12:00:00+01:00',
              tilDato: '2030-01-30T12:00:00+01:00',
              opprettetDato: '2018-01-31T10:46:24.189+01:00',
              endretDato: '2018-01-31T10:46:25.801+01:00',
              endretAv: 'Z123456',
              historisk: false,
              avtalt: false,
              lagtInnAv: 'NAV',
              transaksjonsType: 'AVTALT',
              etikett: 'SOKNAD_SENDT',
              kontaktperson: 'Sabeltann',
              arbeidsgiver: 'Skipet AS',
              arbeidssted: 'Skipet',
              erReferatPublisert: false,
          }),
          wrapAktivitet({
              id: '5',
              versjon: '2410',
              tittel: 'Ta et webkurs',
              beskrivelse: 'Jeg skal bli awesome i html. Sjørøvere trenger å være awesome i html',
              lenke: 'www.nav.no',
              type: 'EGEN',
              status: 'BRUKER_ER_INTERESSERT',
              fraDato: '2020-01-01T12:00:00+01:00',
              tilDato: '2020-12-01T12:00:00+01:00',
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
              beskrivelse: 'Vi ønsker å snakke med deg om aktiviteter du har gjennomført og videre oppfølging.',
              lenke: null,
              type: 'MOTE',
              status: 'PLANLAGT',
              fraDato: '2030-08-21T08:00:00+02:00',
              tilDato: '2030-08-21T12:15:00+02:00',
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
              adresse: 'Ditt nærmeste NAV kontor',
              erReferatPublisert: false,
          }),
          wrapAktivitet({
              id: '10',
              versjon: '200',
              tittel: 'Gamelt Beste møtet ever',
              beskrivelse: 'Vi ønsker å snakke med deg om aktiviteter du har gjennomført og videre oppfølging.',
              lenke: null,
              type: 'MOTE',
              status: 'PLANLAGT',
              fraDato: '2017-02-16T00:00:00+01:00',
              tilDato: '2017-02-16T00:00:00+02:00',
              opprettetDato: '2017-02-16T00:00:00+01:00',
              endretDato: '2017-02-16T00:00:00+01:00',
              endretAv: 'z990207',
              historisk: true,
              avsluttetKommentar: null,
              avtalt: true,
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
          wrapAktivitet({
              id: '1550',
              versjon: '9825',
              tittel: 'Avtale om å søke jobber',
              beskrivelse:
                  'NAV forventer at du søker omtrent 20 stillinger i denne perioden. Det er viktig at du søker på de jobbene du mener du er kvalifisert for. Det er også viktig å søke på mange stillinger, det øker sjansene dine til å finne en jobb. Legg til hver stilling du søker i aktiviteten «En jobb jeg vil søke på».',
              lenke: null,
              type: 'SOKEAVTALE',
              status: 'GJENNOMFORES',
              fraDato: '2030-08-21T08:00:00+02:00',
              tilDato: '2020-08-21T12:15:00+02:00',
              opprettetDato: '2018-08-21T11:55:14.044+02:00',
              endretDato: '2018-08-21T11:57:57.636+02:00',
              endretAv: 'z990207',
              historisk: false,
              avsluttetKommentar: null,
              avtalt: true,
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
              antallStillingerIUken: 5,
              avtaleOppfolging: null,
              jobbStatus: null,
              ansettelsesforhold: null,
              arbeidstid: null,
              behandlingType: null,
              behandlingSted: null,
              effekt: null,
              behandlingOppfolging: null,
              kanal: null,
              erReferatPublisert: false,
              forhaandsorientering: {
                  tekst:
                      'Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ber vi deg ta kontakt med veilederen din så snart som mulig.',
                  type: 'SEND_FORHAANDSORIENTERING',
              },
          }),
          wrapAktivitet({
              adresse: null,
              ansettelsesforhold: null,
              antallStillingerIUken: null,
              antallStillingerSokes: null,
              arbeidsgiver: null,
              arbeidssted: null,
              arbeidstid: null,
              avsluttetKommentar: null,
              avtaleOppfolging: null,
              avtalt: true,
              behandlingOppfolging: null,
              behandlingSted: null,
              behandlingType: null,
              beskrivelse: null,
              effekt: null,
              endretAv: '1602677081175',
              endretDato: '2020-10-14T12:04:41.175Z',
              erReferatPublisert: true,
              etikett: null,
              forberedelser: null,
              fraDato: '2020-10-14T12:04:33.649Z',
              hensikt: null,
              historisk: false,
              id: '7005970',
              jobbStatus: null,
              kanal: 'TELEFON',
              kontaktperson: null,
              lagtInnAv: 'NAV',
              lenke: null,
              oppfolging: null,
              opprettetDato: '2020-10-14T12:04:41.175Z',
              referat: 'Dette er et referat',
              status: 'GJENNOMFORES',
              stillingsTittel: null,
              tilDato: null,
              tittel: 'Prat om pirat',
              transaksjonsType: null,
              type: 'SAMTALEREFERAT',
              versjon: '1',
              forhaandsorientering: {
                  tekst:
                      'Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ber vi deg ta kontakt med veilederen din så snart som mulig.',
                  type: 'SEND_FORHAANDSORIENTERING',
                  lest: '2021-04-04T12:04:41.175Z',
              },
          }),
          wrapAktivitet({
              adresse: null,
              ansettelsesforhold: null,
              antallStillingerIUken: null,
              antallStillingerSokes: null,
              arbeidsgiver: null,
              arbeidssted: null,
              arbeidstid: null,
              avsluttetKommentar: null,
              avtaleOppfolging: null,
              avtalt: true,
              behandlingOppfolging: null,
              behandlingSted: null,
              behandlingType: null,
              beskrivelse: null,
              effekt: null,
              endretAv: '1602677081175',
              endretDato: '2020-10-14T12:04:41.175Z',
              erReferatPublisert: true,
              etikett: null,
              forberedelser: null,
              fraDato: '2020-10-14T12:04:33.649Z',
              hensikt: null,
              historisk: false,
              id: '7005964',
              jobbStatus: null,
              kanal: 'TELEFON',
              kontaktperson: null,
              lagtInnAv: 'NAV',
              lenke: null,
              oppfolging: null,
              opprettetDato: '2020-10-14T12:04:41.175Z',
              referat: 'Dette er et referat',
              status: 'GJENNOMFORES',
              stillingsTittel: null,
              tilDato: null,
              tittel: 'Prat om noe',
              transaksjonsType: null,
              type: 'SAMTALEREFERAT',
              versjon: '1',
          }),
      ];

const automatiskeAktiviteter = !visAutomatiskeAktiviteter()
    ? []
    : [
          {
              id: '141438',
              versjon: '199743',
              tittel: 'Se mulighetene i arbeidsmarkedet',
              beskrivelse:
                  'Hvilke jobber kan du ta og hvilke bransjer kan du jobbe i? Er jobbene der du bor eller andre steder i landet? Velg geografisk område og bransje og se om jobbene finnes. Hvis du mener denne aktiviteten ikke passer for deg, kan du sette den til avbrutt.',
              lenke: 'https://mia-q.nav.no',
              type: 'EGEN',
              status: 'BRUKER_ER_INTERESSERT',
              fraDato: '2019-06-13T10:00:36.255+02:00',
              tilDato: '2019-09-13T10:00:36.255+02:00',
              opprettetDato: '2019-06-13T10:00:36.333+02:00',
              endretDato: '2019-06-13T10:00:36.632+02:00',
              endretAv: 'srvveilarbdirigent',
              historisk: false,
              avsluttetKommentar: null,
              avtalt: false,
              lagtInnAv: 'NAV',
              transaksjonsType: 'OPPRETTET',
              malid: null,
              etikett: null,
              kontaktperson: null,
              arbeidsgiver: null,
              arbeidssted: null,
              stillingsTittel: null,
              hensikt: 'Bli bedre kjent med arbeidsmarkedet',
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
              adresse: null,
              forberedelser: null,
              kanal: null,
              referat: null,
              erReferatPublisert: false,
          },
          {
              id: '141439',
              versjon: '199744',
              tittel: 'Oppdater CV-en og jobbprofilen',
              beskrivelse:
                  'Når du registrerer CV-en og jobbprofilen din, kan vi følge deg opp på en god måte. Du gjør deg synlig for arbeidsgivere som leter etter nye medarbeidere. NAV samarbeider med mange arbeidsgivere og bemanningsbransjen.',
              lenke: 'https://arbeidsplassen-q.nav.no/minside',
              type: 'EGEN',
              status: 'GJENNOMFORES',
              fraDato: '2021-06-13T10:00:36.699+02:00',
              tilDato: '2021-06-21T10:00:36.699+02:00',
              opprettetDato: '2019-06-13T10:00:36.722+02:00',
              endretDato: '2019-06-13T10:00:36.742+02:00',
              endretAv: 'srvveilarbdirigent',
              historisk: false,
              avsluttetKommentar: null,
              avtalt: false,
              lagtInnAv: 'NAV',
              transaksjonsType: 'OPPRETTET',
              malid: null,
              etikett: null,
              kontaktperson: null,
              arbeidsgiver: null,
              arbeidssted: null,
              stillingsTittel: null,
              hensikt: 'Bli synlig for arbeidsgivere',
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
              adresse: null,
              forberedelser: null,
              kanal: null,
              referat: null,
              erReferatPublisert: false,
          },
          {
              id: '141440',
              versjon: '199745',
              tittel: 'Jobbsøkertips',
              beskrivelse:
                  'Svar på noen spørsmål om hvordan du søker på jobber. Få råd og tips til søknaden, CV-en, intervjuet og hvordan du finner jobbene.',
              lenke: 'https://jobbsokerkompetanse-q.nav.no/',
              type: 'EGEN',
              status: 'BRUKER_ER_INTERESSERT',
              fraDato: '2019-06-13T10:00:36.785+02:00',
              tilDato: '2019-06-27T10:00:36.785+02:00',
              opprettetDato: '2019-06-13T10:00:36.81+02:00',
              endretDato: '2019-06-13T10:00:36.988+02:00',
              endretAv: 'srvveilarbdirigent',
              historisk: false,
              avsluttetKommentar: null,
              avtalt: false,
              lagtInnAv: 'NAV',
              transaksjonsType: 'OPPRETTET',
              malid: null,
              etikett: null,
              kontaktperson: null,
              arbeidsgiver: null,
              arbeidssted: null,
              stillingsTittel: null,
              hensikt: 'Få råd og tips når du søker jobber',
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
              adresse: null,
              forberedelser: null,
              kanal: null,
              referat: null,
              erReferatPublisert: false,
          },
      ];

const aktiviteter = testAktiviteter.concat(automatiskeAktiviteter);

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

function valueAsNumberOrNull(potentialValue) {
    if (potentialValue) {
        return parseInt(potentialValue);
    }
    return null;
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
        antallStillingerSokes: valueAsNumberOrNull(aktivitet.antallStillingerSokes),
        antallStillingerIUken: valueAsNumberOrNull(aktivitet.antallStillingerIUken),
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
        forhaandsorientering: valueOrNull(aktivitet.forhaandsorientering),
    };
}

export function getAktivitet({ aktivitetId }) {
    return aktiviteter.filter((akivitet) => akivitet.id === aktivitetId)[0];
}

export function getAktivitetVersjoner({ aktivitetId }) {
    const aktivitet = getAktivitet({ aktivitetId });
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

export function opprettAktivitet(pathParams, body) {
    const newAktivitet = wrapAktivitet({
        id: rndId(),
        opprettetDato: new Date(),
        lagtInnAv: bruker,
        endretDato: moment().toISOString(),
        endretAv: null,
        versjon: '1',
        erLestAvBruker: eksternBruker,
        ...body,
    });
    aktiviteter.push(newAktivitet);
    return newAktivitet;
}

export function oppdaterAktivitet({ aktivitetId }, aktivitet) {
    const oldAktivitet = aktiviteter.find((aktivitet) => aktivitet.id === aktivitetId);
    Object.assign(oldAktivitet, aktivitet);
    oldAktivitet.endretDato = moment().toISOString();
    oldAktivitet.endretAv = bruker;
    oldAktivitet.lagtInnAv = bruker;

    return oldAktivitet;
}

export function oppdaterAvtaltMedNav(__params, { forhaandsorientering }, { aktivitetId }) {
    const aktivitet = aktiviteter.find((aktivitet) => aktivitet.id === aktivitetId);

    aktivitet.endretDato = moment().toISOString();
    aktivitet.endretAv = bruker;
    aktivitet.lagtInnAv = bruker;
    aktivitet.forhaandsorientering = {
        type: forhaandsorientering.type,
        tekst: forhaandsorientering.tekst,
    };
    aktivitet.avtalt = true;
    return aktivitet;
}

export function oppdaterLestFho(__params, { aktivitetId }) {
    const aktivitet = aktiviteter.find((aktivitet) => aktivitet.id === aktivitetId);

    aktivitet.forhaandsorientering = {
        ...aktivitet.forhaandsorientering,
        lest: moment().toISOString(),
    };
    return aktivitet;
}

export function publiserReferat({ aktivitetId }) {
    const oldAktivitet = aktiviteter.find((akivitet) => akivitet.id === aktivitetId);
    oldAktivitet.erReferatPublisert = true;
    return { ...oldAktivitet, erReferatPublisert: true };
}

export const aktiviteterData = {
    aktiviteter,
};
