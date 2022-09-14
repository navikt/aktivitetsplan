import moment from 'moment';

import { IKKE_FATT_JOBBEN, STATUS_AVBRUTT, STATUS_FULLFOERT, STATUS_GJENNOMFOERT } from '../constant';
import { erEksternBruker, visAutomatiskeAktiviteter, visTestAktiviteter } from './demo/sessionstorage';
import { enStillingAktivitet } from './fixtures/stillingFixtures';
import {
    enStillingFraNavAktivitet,
    enStillingFraNavData,
    etTidspunkt,
    jaCvKanDeles,
    navAnsatt1,
    navAnsatt2,
} from './fixtures/stillingFraNavFixtures';
import { enLestForhaandsorientering, enUlestForhaandsorientering } from './forhaandsorienteringFixtures';
import { etSamtalereferat } from './samtalereferatFixtures';
import { enSokeAktivitet } from './sokeAktivitetFixtures';
import { rndId } from './utils';

const eksternBruker = erEksternBruker();
const bruker = eksternBruker ? 'BRUKER' : 'NAV';

const testAktiviteter = !visTestAktiviteter()
    ? []
    : [
          wrapAktivitet({
              ...enStillingAktivitet({ tittel: 'Kaptein sabeltann' }),
              beskrivelse: 'Vi reiste fra karibien og ankret opp i natt',
              arbeidsgiver: 'Den sorte dame AS',
              kontaktperson: 'Sabeltann sin mor',
              arbeidssted: 'Karibien',
          }),
          wrapAktivitet({
              ...enStillingAktivitet({ tittel: 'Langemann' }),
              beskrivelse: 'Ute på åpent hav, er jeg kjent som sabeltanns skygge',
              status: 'GJENNOMFORES',
              etikett: 'SOKNAD_SENDT',
              kontaktperson: 'Sabeltann',
              arbeidsgiver: 'Kaptein Sabeltann',
              arbeidssted: 'Den sorte dame',
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
              transaksjonsType: 'OPPRETTET',
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
              transaksjonsType: 'OPPRETTET',
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
              transaksjonsType: 'BLE_HISTORISK',
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
              ...enSokeAktivitet({ tittel: 'Denne har en ulest forhåndsorientering' }),
              forhaandsorientering: enUlestForhaandsorientering,
          }),
          wrapAktivitet({
              ...enSokeAktivitet({ tittel: 'Gi aldri opp! Kjemp hvis du kan.' }),
              beskrivelse:
                  'Du er unik. Vi vet at det finnes en arbeidsgiver der ute som ser etter akkurat deg. Plutselig klaffer det, det vet jeg. Har du sett denne lenken? Det er Rick Astley.\n' +
                  'https://www.youtube.com/watch?v=xvFZjo5PgG0',
          }),
          wrapAktivitet({
              ...etSamtalereferat({ tittel: 'Denne har en lest forhåndsorientering' }),
              forhaandsorientering: enLestForhaandsorientering,
          }),
          wrapAktivitet({
              ...etSamtalereferat({ tittel: 'Inneholder et langt referat med lenke' }),
              erReferatPublisert: false,
              referat:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Se også https://www.nav.no/',
          }),
          wrapAktivitet({
              ...etSamtalereferat({ tittel: 'Et rykte sprer seg raskt som en brann' }),
              referat:
                  'Nå kommer Sabeltann til Stortinget: https://www.stortinget.no/no/ \n' +
                  'Her er litt mer informasjon om hva dette innebærer: https://no.wikipedia.org/wiki/Sj%C3%B8r%C3%B8veri',
          }),
          wrapAktivitet(enStillingFraNavAktivitet({ tittel: 'Servitør historisk', arstall: 2017 })),
          wrapAktivitet({
              ...enStillingFraNavAktivitet({ tittel: 'Servitør ikke svart' }),
              status: 'PLANLAGT',
              opprettetDato: etTidspunkt(2020),
              endretDato: etTidspunkt(2018),
              historisk: false,
              transaksjonsType: 'OPPRETTET',
              stillingFraNavData: {
                  ...enStillingFraNavData,
                  svarfrist: etTidspunkt(2030),
                  kontaktpersonData: navAnsatt1,
              },
          }),
          wrapAktivitet({
              ...enStillingFraNavAktivitet({ tittel: 'Servitør ikke svart innen fristen' }),
              status: STATUS_AVBRUTT,
              opprettetDato: etTidspunkt(2020),
              endretDato: etTidspunkt(2018),
              historisk: false,
              transaksjonsType: 'OPPRETTET',
              stillingFraNavData: {
                  ...enStillingFraNavData,
                  svarfrist: etTidspunkt(2021),
                  kontaktpersonData: navAnsatt2,
              },
          }),
          wrapAktivitet({
              ...enStillingFraNavAktivitet({ tittel: 'Servitør har svart', arstall: 2020 }),
              stillingFraNavData: { ...enStillingFraNavData, cvKanDelesData: jaCvKanDeles },
          }),
          wrapAktivitet({
              ...enStillingFraNavAktivitet({ tittel: 'Assisterende skipskokk', arstall: 2020 }),
              stillingFraNavData: { ...enStillingFraNavData, cvKanDelesData: jaCvKanDeles, soknadsstatus: 'CV_DELT' },
          }),
          wrapAktivitet({
              ...enStillingFraNavAktivitet({ tittel: 'Greve av Gral', arstall: 2023 }),
              status: STATUS_FULLFOERT,
              transaksjonsType: 'IKKE_FATT_JOBBEN',
              stillingFraNavData: {
                  ...enStillingFraNavData,
                  cvKanDelesData: jaCvKanDeles,
                  soknadsstatus: IKKE_FATT_JOBBEN,
                  ikkefattjobbendetaljer: `KANDIDATLISTE_LUKKET_NOEN_ANDRE_FIKK_JOBBEN`,
              },
          }),
          wrapAktivitet({
              ...enStillingAktivitet({ tittel: 'Grusomme Gabriel' }),
              beskrivelse: 'I hundre år har jeg lært å skremme',
              arbeidssted: 'De syv hav',
              arbeidsgiver: 'De verste sjørøverne',
              status: STATUS_FULLFOERT,
              fraDato: moment().subtract(120, 'year').format(),
              tilDato: undefined,
              endretDato: moment().subtract(100, 'year').format(),
          }),
          wrapAktivitet({
              ...enStillingAktivitet({ tittel: 'Ana Baroma' }),
              beskrivelse: 'Jeg får det alltid som jeg vil',
              arbeidssted: 'Øya Gral',
              arbeidsgiver: 'Heksesprell',
              status: STATUS_FULLFOERT,
              fraDato: moment().subtract(120, 'year').format(),
              tilDato: undefined,
              endretDato: moment().subtract(1, 'day').format(),
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
              stillingFraNavData: null,
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
const ekstraVersjoner = !visTestAktiviteter()
    ? []
    : [
          wrapAktivitet({
              ...enStillingFraNavAktivitet({ tittel: 'Servitør har svart', arstall: 2020 }),
              status: 'PLANLAGT',
              transaksjonsType: 'OPPRETTET',
              stillingFraNavData: enStillingFraNavData,
          }),
          wrapAktivitet({
              ...enStillingFraNavAktivitet({ tittel: 'Servitør har svart', arstall: 2020 }),
              status: 'PLANLAGT',
              transaksjonsType: 'DEL_CV_SVART',
              stillingFraNavData: { ...enStillingFraNavData, cvKanDelesData: jaCvKanDeles },
          }),
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
        stillingFraNavData: valueOrNull(aktivitet.stillingFraNavData),
    };
}

export function getAktivitet({ aktivitetId }) {
    return aktiviteter.find((aktivitet) => aktivitet.id === aktivitetId);
}

export function getAktivitetVersjoner({ aktivitetId }) {
    return versjoner.filter((aktivitet) => aktivitet.id === aktivitetId);
}

export function opprettAktivitet(_pathParams, body) {
    const nyAktivitet = wrapAktivitet({
        id: rndId(),
        opprettetDato: new Date(),
        lagtInnAv: bruker,
        endretDato: moment().toISOString(),
        endretAv: bruker,
        versjon: '1',
        erLestAvBruker: eksternBruker,
        transaksjonsType: 'OPPRETTET',
        ...body,
    });
    aktiviteter.push(nyAktivitet);
    const nyAktivitetKlone = wrapAktivitet(nyAktivitet);
    versjoner.push(nyAktivitetKlone);
    return nyAktivitet;
}

function doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId, nyeAktivitetAttributter) {
    // Hent den gamle aktiviteten
    const gammelAktivitet = aktiviteter.find((a) => a.id === aktivitetId);
    // Merge de nye attributtene og den originale aktiviteten inn i en ny aktivitet
    const nyAktivitet = {
        ...gammelAktivitet,
        ...lagNyVersion({ ...nyeAktivitetAttributter, versjon: gammelAktivitet.versjon }),
    };

    // Legg til ny versjon i historikk
    versjoner.push(nyAktivitet);
    // Overskriv den gamle aktiviteten i aktiviteterData
    Object.assign(gammelAktivitet, nyAktivitet);

    return nyAktivitet;
}

function lagNyVersion(aktivitet) {
    return {
        ...aktivitet,
        // versjon er typet som string, men er et løpenummer (egentlig global sekvens for alle aktiviteter), derfor denne hacken.
        versjon: String(parseInt(aktivitet.versjon) + 1),
        endretDato: moment().toISOString(),
        endretAv: bruker,
        lagtInnAv: bruker,
    };
}

export function oppdaterAktivitet({ aktivitetId }, aktivitetPayload) {
    const nyeAktivitetAttributter = {
        ...aktivitetPayload,
        transaksjonsType: 'DETALJER_ENDRET',
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId, nyeAktivitetAttributter);
}

export function oppdaterAktivitetStatus({ aktivitetId }, aktivitetPayload) {
    const nyeAktivitetAttributter = {
        ...aktivitetPayload,
        transaksjonsType: 'STATUS_ENDRET',
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId, nyeAktivitetAttributter);
}

export function oppdaterEtikett({ aktivitetId }, aktivitetPayload) {
    const nyeAktivitetAttributter = {
        ...aktivitetPayload,
        transaksjonsType: 'ETIKETT_ENDRET',
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId, nyeAktivitetAttributter);
}

export function oppdaterAvtaltMedNav(__params, { forhaandsorientering }, { aktivitetId }) {
    const nyeAktivitetAttributter = {
        forhaandsorientering: forhaandsorientering,
        avtalt: true,
        transaksjonsType: 'AVTALT',
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId, nyeAktivitetAttributter);
}

export function oppdaterCVKanDelesSvar(__params, { _aktivitetVersjon, kanDeles, avtaltDato }, { aktivitetId }) {
    const gammelAktivitet = aktiviteter.find((akivitet) => akivitet.id === aktivitetId);
    const nyeAktivitetAttributter = {
        status: kanDeles ? STATUS_GJENNOMFOERT : STATUS_AVBRUTT,
        transaksjonsType: 'DEL_CV_SVART',
        stillingFraNavData: {
            ...gammelAktivitet.stillingFraNavData,
            cvKanDelesData: {
                kanDeles: kanDeles,
                endretTidspunkt: new Date(),
                avtaltDato: avtaltDato,
                endretAv: bruker ? '843029483' : 'z123',
                endretAvType: bruker,
            },
            soknadsstatus: kanDeles ? 'VENTER' : null,
        },
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId, nyeAktivitetAttributter);
}

export function oppdaterStillingFraNavSoknadsstatus(__params, { _aktivitetVersjon, soknadsstatus }, { aktivitetId }) {
    const gammelAktivitet = aktiviteter.find((aktivitet) => aktivitet.id === aktivitetId);
    const nyeAktivitetAttributter = {
        stillingFraNavData: {
            ...gammelAktivitet.stillingFraNavData,
            soknadsstatus: soknadsstatus,
        },
        transaksjonsType: 'SOKNADSSTATUS_ENDRET',
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId, nyeAktivitetAttributter);
}

export function oppdaterLestFho(__params, { aktivitetId }) {
    const gammelAktivitet = aktiviteter.find((akivitet) => akivitet.id === aktivitetId);
    const nyeAktivitetAttributter = {
        forhaandsorientering: {
            ...gammelAktivitet.forhaandsorientering,
            lestDato: moment().toISOString(),
        },
        transaksjonsType: 'FORHAANDSORIENTERING_LEST',
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId, nyeAktivitetAttributter);
}

export function publiserReferat({ aktivitetId }) {
    const nyeAktivitetAttributter = {
        erReferatPublisert: true,
        transaksjonsType: 'REFERAT_PUBLISERT',
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId, nyeAktivitetAttributter);
}

export function endreReferat({ aktivitetId }, aktivitetPayload) {
    const nyeAktivitetAttributter = {
        ...aktivitetPayload,
        transaksjonsType: 'REFERAT_ENDRET',
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId, nyeAktivitetAttributter);
}

export const aktiviteterData = {
    aktiviteter,
};
export const versjoner = aktiviteter.concat(ekstraVersjoner).map((aktivitet) => wrapAktivitet(aktivitet));
