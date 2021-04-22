import moment from 'moment';

import { visArenaAktiviteter } from './demo/sessionstorage';

export const arena = !visArenaAktiviteter()
    ? []
    : [
          {
              id: 'ARENATA11',
              status: 'GJENNOMFORES',
              type: 'TILTAKSAKTIVITET',
              tittel: 'Klatrekurs i seil',
              beskrivelse: 'Sjørøvere trenger å kunne klatre i seil',
              fraDato: '2017-07-01T00:00:00+02:00',
              tilDato: '2025-12-31T00:00:00+01:00',
              opprettetDato: '2018-09-02T00:00:00+02:00',
              avtalt: true,
              deltakelseProsent: 95.6,
              tiltaksnavn: 'Trening123',
              tiltakLokaltNavn: 'NAV OSLO',
              arrangoer: 'Pelle',
              bedriftsnummer: '123456789',
              antallDagerPerUke: 5.0,
              statusSistEndret: '2017-07-02T00:00:00+02:00',
              etikett: null,
              moeteplanListe: null,
          },
          {
              id: 'ARENATA22',
              status: 'AVBRUTT',
              type: 'TILTAKSAKTIVITET',
              tittel: 'Seiling',
              beskrivelse: 'Sjårøvere trenger å kunne seile',
              fraDato: '2017-02-16T00:00:00+01:00',
              tilDato: '2017-06-30T00:00:00+02:00',
              opprettetDato: '2017-06-30T00:00:00+02:00',
              avtalt: true,
              deltakelseProsent: 30.0,
              tiltaksnavn: 'Trening123',
              tiltakLokaltNavn: 'NAV OSLO',
              arrangoer: 'Pelle',
              bedriftsnummer: '123456789',
              antallDagerPerUke: 1.5,
              statusSistEndret: '2017-06-30T00:00:00+02:00',
              etikett: null,
              moeteplanListe: null,
          },
          {
              id: 'ARENATA33',
              status: 'GJENNOMFORES',
              type: 'TILTAKSAKTIVITET',
              tittel: 'Seiling på hav',
              beskrivelse: 'Sjårøvere trenger å kunne seile på hav',
              fraDato: '2017-02-16T00:00:00+01:00',
              tilDato: '2025-12-31T00:00:00+01:00',
              opprettetDato: '2018-09-02T00:00:00+02:00',
              avtalt: true,
              deltakelseProsent: 30.0,
              tiltaksnavn: 'Trening123',
              tiltakLokaltNavn: 'NAV OSLO',
              arrangoer: 'Pelle',
              bedriftsnummer: '123456789',
              antallDagerPerUke: 1.5,
              statusSistEndret: '2017-06-30T00:00:00+02:00',
              etikett: null,
              moeteplanListe: null,
              forhaandsorientering: {
                  tekst:
                      'Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ber vi deg ta kontakt med veilederen din så snart som mulig.',
                  type: 'SEND_FORHAANDSORIENTERING',
              },
          },
          {
              id: 'ARENAGA120719688',
              status: 'FULLFORT',
              type: 'GRUPPEAKTIVITET',
              tittel: 'Informasjonsmøte om arbeidsavklaringspenger',
              beskrivelse: 'test',
              fraDato: '2018-02-22T13:00:00+01:00',
              tilDato: '2018-02-22T00:00:00+01:00',
              opprettetDato: '2018-02-22T13:00:00+01:00',
              avtalt: true,
              etikett: null,
              deltakelseProsent: null,
              tiltaksnavn: null,
              tiltakLokaltNavn: null,
              arrangoer: null,
              bedriftsnummer: null,
              antallDagerPerUke: null,
              statusSistEndret: null,
              moeteplanListe: [
                  {
                      startDato: '2018-02-22T13:00:00+01:00',
                      sluttDato: '2018-02-22T00:00:00+01:00',
                      sted: 'NAV Frogner, Sommerrogata 1 (v/Solli Plass), 0255 Oslo',
                  },
              ],
          },
      ];

export const oppdaterArenaaktivitet = (__params, forhaandsorientering, { arenaaktivitetId }) => {
    const aktivitet = arena.find((arenaaktivitet) => arenaaktivitet.id === arenaaktivitetId);

    aktivitet.forhaandsorientering = {
        type: forhaandsorientering.type,
        tekst: forhaandsorientering.tekst,
    };

    return aktivitet;
};

export const oppdaterLestFhoArenaaktivitet = (__params, __body, { aktivitetId }) => {
    const lestAktivitet = arena.find((arenaaktivitet) => arenaaktivitet.id === aktivitetId);

    lestAktivitet.forhaandsorientering = {
        ...lestAktivitet.forhaandsorientering,
        lest: moment().toISOString(),
    };

    return lestAktivitet;
};
