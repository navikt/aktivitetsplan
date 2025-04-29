import { addDays, subDays } from 'date-fns';

import { AktivitetStatus } from '../datatypes/aktivitetTypes';
import { EksternAktivitetType, VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { wrapAktivitet } from './aktivitet';
import { visEksterneAktiviteter } from './demo/localStorage';
import { enEksternAktivitet } from './fixtures/eksternAktivitetFixtures';

export const eksterneAktiviteter: VeilarbAktivitet[] = !visEksterneAktiviteter()
    ? []
    : [
          wrapAktivitet({
              ...enEksternAktivitet({
                  tittel: 'Nå kan han lukte gull, derfor ror vi inn mot land',
                  status: AktivitetStatus.PLANLAGT,
                  avtalt: true,
                  beskrivelse: 'Denne aktiviteten har blitt overført fra Arena og ligger nå i veilarbaktivitet',
                  eksternAktivitet: {
                      type: EksternAktivitetType.ARENA_TILTAK_TYPE,
                      oppgave: undefined,
                      handlinger: undefined,
                      detaljer: [
                          { label: 'Deltakelse', verdi: '95.6%' },
                          { label: 'Antall dager per uke', verdi: '5' },
                      ],
                      etiketter: [{ kode: 'SOKT_INN' }, { kode: 'AVSLAG' }],
                  },
              }),
              fraDato: undefined,
              tilDato: undefined,
          }),
          wrapAktivitet({
              ...enEksternAktivitet({
                  tittel: 'testestestest',
                  status: AktivitetStatus.PLANLAGT,
                  avtalt: false,
                  beskrivelse: 'Denne aktiviteten har blitt overført fra Arena og ligger nå i veilarbaktivitet',
                  eksternAktivitet: {
                      type: EksternAktivitetType.ARENA_TILTAK_TYPE,
                      oppgave: {
                          ekstern: {
                              tekst: 'Evaluer deltakelsen',
                              knapptekst: 'Gi din evaluering',
                              url: 'http://localhost:8080/ekstern',
                              subtekst: 'Du har vært hos muligheter i 5 måneder',
                          },
                          intern: {
                              tekst: 'Evaluer deltakelsen',
                              knapptekst: 'Gi din evaluering',
                              url: 'http://localhost:8080/ekstern',
                              subtekst: 'Du har vært hos muligheter i 5 måneder',
                          },
                      },
                      handlinger: undefined,
                      detaljer: [
                          { label: 'Deltakelse', verdi: '95.6%' },
                          { label: 'Antall dager per uke', verdi: '5' },
                      ],
                      etiketter: [{ kode: 'SOKT_INN' }],
                  },
              }),
              fraDato: subDays(new Date(), 2).toISOString(),
              tilDato: addDays(new Date(), 8).toISOString(),
          }),
          wrapAktivitet({
              ...enEksternAktivitet({
                  tittel: 'Saltrød og Høneby',
                  status: AktivitetStatus.GJENNOMFOERT,
                  avtalt: false,
                  beskrivelse: 'Beskrivelse asdasdasdsasd',
                  eksternAktivitet: {
                      type: EksternAktivitetType.MIDL_LONNSTILSKUDD_TYPE,
                      oppgave: undefined,
                      handlinger: undefined,
                      detaljer: undefined,
                      etiketter: undefined,
                  },
              }),
          }),
          wrapAktivitet({
              ...enEksternAktivitet({
                  tittel: 'Varig lønnstilskudd hos Biggen Blues og Bensin',
                  status: AktivitetStatus.PLANLAGT,
                  avtalt: true,
                  beskrivelse: 'Pumpeoperatør',
                  eksternAktivitet: {
                      type: EksternAktivitetType.VARIG_LONNSTILSKUDD_TYPE,
                      oppgave: undefined,
                      handlinger: undefined,
                      detaljer: [
                          { label: 'Arbeidsgiver', verdi: 'Biggen Blues og Bensin' },
                          { label: 'Stillingsprosent', verdi: '100%' },
                      ],
                      etiketter: undefined,
                  },
              }),
          }),
        wrapAktivitet({
                      ...enEksternAktivitet({
                          tittel: 'Arbeidstrening hos Biggen Blues og Bensin',
                          status: AktivitetStatus.GJENNOMFOERT,
                          avtalt: true,
                          beskrivelse: 'Pumpeoperatør',
                          eksternAktivitet: {
                              type: EksternAktivitetType.ARBEIDSTRENING,
                              oppgave: undefined,
                              handlinger: undefined,
                              detaljer: [
                                  { label: 'Arbeidsgiver', verdi: 'Biggen Blues og Bensin' },
                                  { label: 'Stillingsprosent', verdi: '100%' },
                              ],
                              etiketter: undefined,
                          },
                      }),
                  }),
          wrapAktivitet({
              ...enEksternAktivitet({
                  tittel: 'Oppfølging hos Biggen',
                  status: AktivitetStatus.PLANLAGT,
                  avtalt: true,
                  beskrivelse: '',
                  eksternAktivitet: {
                      type: EksternAktivitetType.INDOPPFAG,
                      oppgave: undefined,
                      handlinger: undefined,
                      detaljer: [
                          { label: 'Arrangør', verdi: 'Biggen Oppfølging' },
                          { label: 'Oppfølging', verdi: 'ukentlig' },
                      ],
                      etiketter: undefined,
                  },
              }),
          }),
          wrapAktivitet({
              ...enEksternAktivitet({
                  tittel: 'Tilrettelags arbeid hos Biggen',
                  status: AktivitetStatus.PLANLAGT,
                  avtalt: true,
                  beskrivelse: '',
                  eksternAktivitet: {
                      type: EksternAktivitetType.VASV,
                      oppgave: undefined,
                      handlinger: [
                          {
                              tekst: 'Biggens hjemmeside',
                              subtekst: '',
                              url: 'https://www.nav.no/',
                              lenkeType: 'FELLES',
                          },
                      ],
                      detaljer: [
                          { label: 'Arrangør', verdi: 'Biggen verna avdeling' },
                          { label: 'Stillingsprosent', verdi: '5%' },
                      ],
                      etiketter: undefined,
                  },
              }),
              forhaandsorientering: {
                  type: 'SEND_FORHAANDSORIENTERING',
                  tekst: 'Det er viktig at du gjennomfører denne aktiviteten med Nav. Gjør du ikke det, kan det medføre at stønaden du mottar fra Nav bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ber vi deg ta kontakt med veilederen din så snart som mulig.',
              },
          }),
          wrapAktivitet({
              ...enEksternAktivitet({
                  tittel: 'Saltrød og Høneby - med oppgave',
                  status: AktivitetStatus.GJENNOMFOERT,
                  avtalt: true,
                  beskrivelse:
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce blandit sollicitudin odio, nec eleifend nibh pulvinar ac. Donec sed sem.',
                  eksternAktivitet: {
                      type: EksternAktivitetType.MIDL_LONNSTILSKUDD_TYPE,
                      oppgave: {
                          ekstern: {
                              tekst: 'Du må godkjenne avtalen',
                              subtekst:
                                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet justo sit amet turpis eleifend bibendum nec ac ipsum. Mauris et hendrerit justo. Nulla varius tristique magna at pellentesque.',
                              url: 'https://www.nav.no/',
                              knapptekst: 'Lorem ipsum',
                          },
                          intern: undefined,
                      },
                      handlinger: [
                          {
                              tekst: 'Gå til avtalen',
                              subtekst: 'Avtale undertekst blah blah',
                              url: 'https://www.nav.no/',
                              lenkeType: 'FELLES',
                          },
                          {
                              tekst: 'Denne handlingen kan kun veiledere se',
                              subtekst: undefined,
                              url: 'https://www.nav.no/',
                              lenkeType: 'INTERN',
                          },
                      ],
                      detaljer: [
                          { label: 'Abc', verdi: 'def' },
                          { label: 'Ghi', verdi: 'jkl' },
                      ],
                      etiketter: undefined,
                  },
              }),
          }),
        wrapAktivitet({
                      ...enEksternAktivitet({
                          tittel: 'Rekrutteringstreff hos Biggen',
                          status: AktivitetStatus.PLANLAGT,
                          avtalt: false,
                          beskrivelse:
                              'Velkommen til jobmesse hos Biggen. Her vil du møte flere arbeidsgivere som er på jakt etter nye medarbeidere. Du vil også få mulighet til å delta på workshops og få tips til hvordan du kan skrive en god CV og forberede deg til jobbintervju.',
                          eksternAktivitet: {
                              type: EksternAktivitetType.REKRUTTERINGSTREFF,
                              handlinger: [
                                  {
                                      tekst: 'Gå til arrangementet for å bekrefte om du kommer eller ikke',
                                      subtekst: 'Du _må_ ikke',
                                      url: 'https://www.nav.no/',
                                      lenkeType: 'FELLES',
                                  },
                                  {
                                      tekst: 'Bekreft om bruker planlegger å delta',
                                      subtekst: undefined,
                                      url: 'https://www.nav.no/',
                                      lenkeType: 'INTERN',
                                  },
                              ],
                              detaljer: [
                                  { label: 'Tid', verdi: '10.januar 2026' },
                                  { label: 'Sted', verdi: 'Verkstedveien 20, Lillestrøm' },
                              ],
                              etiketter: [{ tekst: 'Venter på svar', sentiment: 'POSITIVE' }],
                          },
                      }),
                  }),
        wrapAktivitet({
            ...enEksternAktivitet({
                tittel: 'Alfheim ordinære virksomhet',
                status: AktivitetStatus.GJENNOMFOERT,
                avtalt: true,
                beskrivelse:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce blandit sollicitudin odio, nec eleifend nibh pulvinar ac. Donec sed sem.',
                eksternAktivitet: {
                    type: EksternAktivitetType.VARIG_TILRETTELAGT_ARBEID_I_ORDINAER_VIRKSOMHET,
                    oppgave: {
                        ekstern: {
                            tekst: 'Du må godkjenne avtalen',
                            subtekst:
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet justo sit amet turpis eleifend bibendum nec ac ipsum. Mauris et hendrerit justo. Nulla varius tristique magna at pellentesque.',
                            url: 'https://www.nav.no/',
                            knapptekst: 'Lorem ipsum',
                        },
                        intern: undefined,
                    },
                    handlinger: [
                        {
                            tekst: 'Gå til avtalen',
                            subtekst: 'Avtale undertekst blah blah',
                            url: 'https://www.nav.no/',
                            lenkeType: 'FELLES',
                        },
                        {
                            tekst: 'Denne handlingen kan kun veiledere se',
                            subtekst: undefined,
                            url: 'https://www.nav.no/',
                            lenkeType: 'INTERN',
                        },
                    ],
                    detaljer: [
                        { label: 'Arbeidsmiljø', verdi: 'mixed' },
                        { label: 'Arbeidssted', verdi: 'verksted' },
                    ],
                    etiketter: undefined,
                },
            }),
        }),
      ];
