import { addDays, subDays } from 'date-fns';
import { RestRequest } from 'msw';

import {
    AktivitetStatus,
    BrukerType,
    Kanal,
    StillingFraNavSoknadsstatus,
    StillingStatus,
} from '../datatypes/aktivitetTypes';
import {
    CvKanDelesData,
    MoteAktivitet,
    StillingAktivitet,
    StillingFraNavAktivitet,
    VeilarbAktivitet,
    VeilarbAktivitetType,
} from '../datatypes/internAktivitetTypes';
import {
    FellesTransaksjonsTyper,
    MoteTransaksjonsType,
    StillingFraNavTransaksjonsType,
    StillingTransaksjonsType,
} from '../datatypes/transaksjonstyperTypes';
import { erEksternBruker, visAutomatiskeAktiviteter, visTestAktiviteter } from './demo/sessionstorage';
import { eksterneAktiviteter } from './eksterneAktiviteter';
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
const bruker: BrukerType = eksternBruker ? 'BRUKER' : 'NAV';

const testAktiviteter: VeilarbAktivitet[] = !visTestAktiviteter()
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
              status: AktivitetStatus.GJENNOMFOERT,
              etikett: StillingStatus.SOKNAD_SENDT,
              kontaktperson: 'Sabeltann',
              arbeidsgiver: 'Kaptein Sabeltann',
              arbeidssted: 'Den sorte dame',
          }),
          wrapAktivitet({
              ...enStillingAktivitet({ tittel: 'Grusomme Gabriel' }),
              beskrivelse: 'Skal skjules bak nedtrekksmeny for eldre aktiviteter',
              arbeidssted: 'De syv hav',
              arbeidsgiver: 'Uendret i lang tid',
              status: AktivitetStatus.FULLFOERT,
              fraDato: subDays(new Date(), 120).toISOString(),
              tilDato: undefined,
              endretDato: subDays(new Date(), 100).toISOString(),
          }),
          wrapAktivitet({
              ...enStillingAktivitet({ tittel: 'Ana Baroma' }),
              beskrivelse: 'Skal ikke skjules bak nedtrekksmeny for eldre aktiviteter',
              arbeidssted: 'Øya Gral',
              arbeidsgiver: 'Endret nylig',
              status: AktivitetStatus.FULLFOERT,
              fraDato: subDays(new Date(), 120).toISOString(),
              tilDato: undefined,
              endretDato: subDays(new Date(), 1).toISOString(),
          }),
          wrapAktivitet({
              id: '5',
              versjon: '2410',
              tittel: 'Ta et webkurs',
              beskrivelse: 'Jeg skal bli awesome i html. Sjørøvere trenger å være awesome i html',
              lenke: 'www.nav.no',
              type: 'EGEN',
              status: AktivitetStatus.BRUKER_ER_INTRESSERT,
              fraDato: '2020-01-01T12:00:00+01:00',
              tilDato: '2020-12-01T12:00:00+01:00',
              opprettetDato: '2018-02-26T15:51:44.197+01:00',
              endretDato: '2018-02-26T15:51:44.85+01:00',
              endretAv: 'Z123456',
              avtalt: false,
              endretAvType: 'NAV',
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
              status: AktivitetStatus.PLANLAGT,
              fraDato: '2030-08-21T08:00:00+02:00',
              tilDato: '2030-08-21T12:15:00+02:00',
              opprettetDato: '2018-08-21T11:55:14.044+02:00',
              endretDato: '2018-08-21T11:57:57.636+02:00',
              endretAv: 'z990207',
              historisk: false,
              avsluttetKommentar: null,
              avtalt: false,
              endretAvType: 'NAV',
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
              kanal: Kanal.TELEFON,
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
              status: AktivitetStatus.PLANLAGT,
              fraDato: '2017-02-16T00:00:00+01:00',
              tilDato: '2017-02-16T00:00:00+02:00',
              opprettetDato: '2017-02-16T00:00:00+01:00',
              endretDato: '2017-02-16T00:00:00+01:00',
              endretAv: 'z990207',
              historisk: true,
              avsluttetKommentar: null,
              avtalt: true,
              endretAvType: 'NAV',
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
              kanal: Kanal.TELEFON,
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
                  'Nå kommer Sabeltann: https://www.britannica.com/animal/Smilodon \n' +
                  'Her er litt mer informasjon om hva dette innebærer for deg: https://no.wikipedia.org/wiki/Sj%C3%B8r%C3%B8veri',
          }),
          wrapAktivitet({
              ...enStillingFraNavAktivitet({ tittel: 'Servitør', arstall: 2017 }),
              arbeidsgiver: 'Historisk',
          }),
          wrapAktivitet({
              ...enStillingFraNavAktivitet({ tittel: 'Servitør (ikke svart)' }),
              arbeidsgiver: 'Har ikke svart ennå',
              status: AktivitetStatus.PLANLAGT,
              opprettetDato: subDays(new Date(), 3).toISOString(),
              endretDato: subDays(new Date(), 3).toISOString(),
              historisk: false,
              transaksjonsType: 'OPPRETTET',
              stillingFraNavData: {
                  ...enStillingFraNavData,
                  svarfrist: addDays(new Date(), 3).toISOString(),
                  kontaktpersonData: navAnsatt1,
              },
          }),
          wrapAktivitet({
              ...enStillingFraNavAktivitet({ tittel: 'Servitør' }),
              arbeidsgiver: 'Har ikke svart innen fristen',
              status: AktivitetStatus.AVBRUTT,
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
              ...enStillingFraNavAktivitet({ tittel: 'Servitør', arstall: 2020 }),
              stillingFraNavData: {
                  ...enStillingFraNavData,
                  cvKanDelesData: jaCvKanDeles,
                  arbeidsgiver: 'Har Svart Innen Fristen AS',
              },
          }),
          wrapAktivitet({
              ...enStillingFraNavAktivitet({ tittel: 'Assisterende skipskokk', arstall: 2020 }),
              stillingFraNavData: {
                  ...enStillingFraNavData,
                  cvKanDelesData: jaCvKanDeles,
                  soknadsstatus: StillingFraNavSoknadsstatus.VENTER,
              },
          }),
          wrapAktivitet({
              ...enStillingFraNavAktivitet({ tittel: 'Greve av Gral', arstall: 2023 }),
              status: AktivitetStatus.FULLFOERT,
              transaksjonsType: StillingFraNavTransaksjonsType.IKKE_FATT_JOBBEN,
              stillingFraNavData: {
                  ...enStillingFraNavData,
                  cvKanDelesData: jaCvKanDeles,
                  soknadsstatus: StillingFraNavSoknadsstatus.IKKE_FATT_JOBBEN,
                  ikkefattjobbendetaljer: `KANDIDATLISTE_LUKKET_NOEN_ANDRE_FIKK_JOBBEN`,
              },
          }),
          wrapAktivitet({
              id: '91495701',
              versjon: '1',
              tittel: 'Medisinsk behandling',
              beskrivelse:
                  'CaCO3 løses i vann ved oppkok og avkjøles til 25˚C.\nLøsningen appliseres til tøystykker og legges rundt bruddstedet. Beinet holdes i ro til gipsen har stivnet. Dette burde ta en dag, men det er lurt å ta forbehold om at det kan gå flere dager.',
              lenke: null,
              type: 'BEHANDLING',
              status: AktivitetStatus.PLANLAGT,
              fraDato: '2022-09-13T14:13:49.000+02:00',
              tilDato: '2022-09-14T14:13:58.000+02:00',
              opprettetDato: '2022-09-13T12:16:08.593Z',
              endretDato: '2022-09-13T12:16:08.593Z',
              endretAv: 'BRUKER',
              historisk: false,
              avsluttetKommentar: null,
              avtalt: true,
              endretAvType: 'BRUKER',
              transaksjonsType: 'OPPRETTET',
              etikett: null,
              kontaktperson: null,
              arbeidsgiver: null,
              arbeidssted: null,
              stillingsTittel: null,
              hensikt: null,
              oppfolging: null,
              antallStillingerSokes: null,
              antallStillingerIUken: null,
              avtaleOppfolging: null,
              jobbStatus: null,
              ansettelsesforhold: null,
              arbeidstid: null,
              behandlingType: 'Bandasje',
              behandlingSted: 'Skyehuset',
              effekt: 'Legge gips på bruddstedet',
              behandlingOppfolging: null,
              adresse: null,
              forberedelser: null,
              kanal: null,
              referat: null,
              erReferatPublisert: false,
              forhaandsorientering: null,
              stillingFraNavData: null,
          }),
      ];

const automatiskeAktiviteter: VeilarbAktivitet[] = !visAutomatiskeAktiviteter()
    ? []
    : [
          {
              id: '141438',
              versjon: '199743',
              tittel: 'Se mulighetene i arbeidsmarkedet',
              beskrivelse:
                  'Hvilke jobber kan du ta og hvilke bransjer kan du jobbe i? Er jobbene der du bor eller andre steder i landet? Velg geografisk område og bransje og se om jobbene finnes. Hvis du mener denne aktiviteten ikke passer for deg, kan du sette den til avbrutt.',
              lenke: 'https://mia-q.nav.no',
              type: VeilarbAktivitetType.EGEN_AKTIVITET_TYPE,
              status: AktivitetStatus.BRUKER_ER_INTRESSERT,
              fraDato: '2019-06-13T10:00:36.255+02:00',
              tilDato: '2019-09-13T10:00:36.255+02:00',
              opprettetDato: '2019-06-13T10:00:36.333+02:00',
              endretDato: '2019-06-13T10:00:36.632+02:00',
              endretAv: 'srvveilarbdirigent',
              historisk: false,
              avsluttetKommentar: undefined,
              avtalt: false,
              endretAvType: 'NAV',
              transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
              etikett: undefined,
              hensikt: 'Bli bedre kjent med arbeidsmarkedet',
              oppfolging: undefined,
          },
          {
              id: '141439',
              versjon: '199744',
              tittel: 'Oppdater CV-en og jobbprofilen',
              beskrivelse:
                  'Når du registrerer CV-en og jobbprofilen din, kan vi følge deg opp på en god måte. Du gjør deg synlig for arbeidsgivere som leter etter nye medarbeidere. NAV samarbeider med mange arbeidsgivere og bemanningsbransjen.',
              lenke: 'https://arbeidsplassen-q.nav.no/minside',
              type: VeilarbAktivitetType.EGEN_AKTIVITET_TYPE,
              status: AktivitetStatus.GJENNOMFOERT,
              fraDato: '2021-06-13T10:00:36.699+02:00',
              tilDato: '2021-06-21T10:00:36.699+02:00',
              opprettetDato: '2019-06-13T10:00:36.722+02:00',
              endretDato: '2019-06-13T10:00:36.742+02:00',
              endretAv: 'srvveilarbdirigent',
              historisk: false,
              avsluttetKommentar: undefined,
              avtalt: false,
              endretAvType: 'NAV',
              transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
              etikett: undefined,
              hensikt: 'Bli synlig for arbeidsgivere',
              oppfolging: undefined,
          },
          {
              id: '141440',
              versjon: '199745',
              tittel: 'Jobbsøkertips',
              beskrivelse:
                  'Svar på noen spørsmål om hvordan du søker på jobber. Få råd og tips til søknaden, CV-en, intervjuet og hvordan du finner jobbene.',
              lenke: 'https://jobbsokerkompetanse-q.nav.no/',
              type: VeilarbAktivitetType.EGEN_AKTIVITET_TYPE,
              status: AktivitetStatus.BRUKER_ER_INTRESSERT,
              fraDato: '2019-06-13T10:00:36.785+02:00',
              tilDato: '2019-06-27T10:00:36.785+02:00',
              opprettetDato: '2019-06-13T10:00:36.81+02:00',
              endretDato: '2019-06-13T10:00:36.988+02:00',
              endretAv: 'srvveilarbdirigent',
              historisk: false,
              avsluttetKommentar: undefined,
              avtalt: false,
              endretAvType: 'NAV',
              transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
              etikett: undefined,
              hensikt: 'Få råd og tips når du søker jobber',
              oppfolging: undefined,
          },
      ];
const ekstraVersjoner = !visTestAktiviteter()
    ? []
    : [
          // wrapAktivitet({
          //     ...enStillingFraNavAktivitet({ tittel: 'Servitør har svart', arstall: 2020 }),
          //     status: 'PLANLAGT',
          //     transaksjonsType: 'OPPRETTET',
          //     stillingFraNavData: enStillingFraNavData,
          // }),
          wrapAktivitet({
              ...enStillingFraNavAktivitet({ tittel: 'Servitør har svart', arstall: 2020 }),
              status: AktivitetStatus.PLANLAGT,
              transaksjonsType: 'DEL_CV_SVART',
              stillingFraNavData: { ...enStillingFraNavData, cvKanDelesData: jaCvKanDeles },
          }),
      ];

const aktiviteter = testAktiviteter.concat(automatiskeAktiviteter).concat(eksterneAktiviteter);

function valueOrNull(potentialValue: any) {
    if (potentialValue) {
        return potentialValue;
    }
    return null;
}

function valueOrNow(potentialValue: any) {
    if (potentialValue) {
        return potentialValue;
    }
    return new Date().toISOString();
}

function valueOrFalse(potentialValue: any) {
    if (potentialValue) {
        return potentialValue;
    }
    return false;
}

function valueAsNumberOrNull(potentialValue: any) {
    if (potentialValue) {
        return parseInt(potentialValue);
    }
    return null;
}

export function wrapAktivitet(aktivitet: any) {
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
        endretAvType: valueOrNull(aktivitet.endretAvType),
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
        eksternAktivitet: valueOrNull(aktivitet.eksternAktivitet),
    };
}

export const getAktivitet = (req: RestRequest) => {
    const aktivitetId = req.params.aktivitetId;

    return aktiviteter.find((aktivitet) => aktivitet.id === aktivitetId);
};

export const getAktivitetVersjoner = (req: RestRequest) => {
    const aktivitetId = req.params.aktivitetId;

    return versjoner.filter((aktivitet) => aktivitet.id === aktivitetId);
};

export const opprettAktivitet = async (req: RestRequest) => {
    const body = await req.json();

    const nyAktivitet = wrapAktivitet({
        id: rndId(),
        opprettetDato: new Date(),
        endretAvType: bruker,
        endretDato: new Date().toISOString(),
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
};

function doOppdaterInternMockStateOgReturnerNyAktivitet(
    aktivitetId: string,
    nyeAktivitetAttributter: Partial<VeilarbAktivitet>
) {
    // Hent den gamle aktiviteten
    const gammelAktivitet = aktiviteter.find((a) => a.id === aktivitetId) as VeilarbAktivitet;
    // Merge de nye attributtene og den originale aktiviteten inn i en ny aktivitet
    const nyAktivitet: VeilarbAktivitet = {
        ...gammelAktivitet,
        ...lagNyVersion({ ...(nyeAktivitetAttributter as VeilarbAktivitet), versjon: gammelAktivitet.versjon }),
    };

    // Legg til ny versjon i historikk
    versjoner.push(nyAktivitet);
    // Overskriv den gamle aktiviteten i aktiviteterData
    Object.assign(gammelAktivitet, nyAktivitet);

    return nyAktivitet;
}

function lagNyVersion(aktivitet: VeilarbAktivitet): VeilarbAktivitet {
    return {
        ...aktivitet,
        // versjon er typet som string, men er et løpenummer (egentlig global sekvens for alle aktiviteter), derfor denne hacken.
        versjon: String(parseInt(aktivitet.versjon) + 1),
        endretDato: new Date().toISOString(),
        endretAv: bruker,
        endretAvType: bruker,
    };
}

export const oppdaterAktivitet = async (req: RestRequest) => {
    const aktivitetId = req.params.aktivitetId;
    const body = await req.json();

    const nyeAktivitetAttributter = {
        ...body,
        transaksjonsType: FellesTransaksjonsTyper.DETALJER_ENDRET,
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId as string, nyeAktivitetAttributter);
};

export const oppdaterAktivitetStatus = async (req: RestRequest) => {
    const aktivitetId = req.params.aktivitetId;
    const body = await req.json();

    const nyeAktivitetAttributter = {
        ...body,
        transaksjonsType: FellesTransaksjonsTyper.STATUS_ENDRET,
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId as string, nyeAktivitetAttributter);
};

export const oppdaterEtikett = async (req: RestRequest) => {
    const aktivitetId = req.params.aktivitetId;
    const body: StillingAktivitet = await req.json();

    const nyeAktivitetAttributter: StillingAktivitet = {
        ...body,
        transaksjonsType: StillingTransaksjonsType.ETIKETT_ENDRET,
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId as string, nyeAktivitetAttributter);
};

export const oppdaterAvtaltMedNav = async (req: RestRequest) => {
    const aktivitetId = req.url.searchParams.get('aktivitetId');
    const body: any = await req.json();

    const nyeAktivitetAttributter: Partial<VeilarbAktivitet> = {
        ...body,
        avtalt: true,
        transaksjonsType: FellesTransaksjonsTyper.AVTALT,
    };

    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId as string, nyeAktivitetAttributter);
};

export const oppdaterCVKanDelesSvar = async (req: RestRequest) => {
    const aktivitetId = req.url.searchParams.get('aktivitetId');
    const cvKanDelesData: CvKanDelesData = await req.json();

    const gammelAktivitet = aktiviteter.find((akivitet) => akivitet.id === aktivitetId) as StillingFraNavAktivitet;
    const nyeAktivitetAttributter: StillingFraNavAktivitet = {
        ...gammelAktivitet,
        status: cvKanDelesData.kanDeles ? AktivitetStatus.GJENNOMFOERT : AktivitetStatus.AVBRUTT,
        transaksjonsType: StillingFraNavTransaksjonsType.DEL_CV_SVART,
        stillingFraNavData: {
            ...gammelAktivitet.stillingFraNavData,
            cvKanDelesData: {
                kanDeles: cvKanDelesData.kanDeles,
                endretTidspunkt: new Date(),
                avtaltDato: cvKanDelesData.avtaltDato,
                endretAv: bruker ? '843029483' : 'z123',
                endretAvType: bruker,
            },
            soknadsstatus: cvKanDelesData.kanDeles ? StillingFraNavSoknadsstatus.VENTER : undefined,
        },
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId as string, nyeAktivitetAttributter);
};

export const oppdaterStillingFraNavSoknadsstatus = async (req: RestRequest) => {
    const aktivitetId = req.url.searchParams.get('aktivitetId');
    const body = await req.json();

    const gammelAktivitet = aktiviteter.find((aktivitet) => aktivitet.id === aktivitetId);
    const nyeAktivitetAttributter = {
        stillingFraNavData: {
            ...(gammelAktivitet as StillingFraNavAktivitet).stillingFraNavData,
            soknadsstatus: body.soknadsstatus,
        },
        transaksjonsType: StillingFraNavTransaksjonsType.SOKNADSSTATUS_ENDRET,
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId as string, nyeAktivitetAttributter);
};

export const oppdaterLestFho = async (req: RestRequest) => {
    const body = await req.json();
    const { aktivitetId } = body;

    const gammelAktivitet = aktiviteter.find((akivitet) => akivitet.id === aktivitetId) as VeilarbAktivitet;
    const nyeAktivitetAttributter: VeilarbAktivitet = {
        ...gammelAktivitet,
        forhaandsorientering: {
            ...gammelAktivitet.forhaandsorientering!,
            lestDato: new Date().toISOString(),
        },
        transaksjonsType: FellesTransaksjonsTyper.FORHAANDSORIENTERING_LEST,
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId, nyeAktivitetAttributter);
};

export const publiserReferat = (req: RestRequest) => {
    const aktivitetId = req.params.aktivitetId;

    const nyeAktivitetAttributter = {
        erReferatPublisert: true,
        transaksjonsType: MoteTransaksjonsType.REFERAT_PUBLISERT,
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId as string, nyeAktivitetAttributter);
};

export const endreReferat = async (req: RestRequest) => {
    const aktivitetId = req.params.aktivitetId;
    const body: MoteAktivitet = await req.json();

    const nyeAktivitetAttributter: MoteAktivitet = {
        ...body,
        transaksjonsType: MoteTransaksjonsType.REFERAT_ENDRET,
    };
    return doOppdaterInternMockStateOgReturnerNyAktivitet(aktivitetId as string, nyeAktivitetAttributter);
};

export const aktiviteterData = {
    aktiviteter,
};
export const versjoner: VeilarbAktivitet[] = aktiviteter
    .concat(ekstraVersjoner)
    .map((aktivitet) => wrapAktivitet(aktivitet));
