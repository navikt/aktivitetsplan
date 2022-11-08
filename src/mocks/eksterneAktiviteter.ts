import { STATUS_GJENNOMFOERT } from '../constant';
import { EksternAktivitetType, VeilarbAktivitet } from '../datatypes/internAktivitetTypes';
import { wrapAktivitet } from './aktivitet';
import { visEksterneAktiviteter } from './demo/sessionstorage';
import { enEksternAktivitet } from './fixtures/eksternAktivitetFixtures';

export const eksterneAktiviteter: VeilarbAktivitet[] = !visEksterneAktiviteter()
    ? []
    : [
          wrapAktivitet({
              ...enEksternAktivitet({
                  tittel: 'Nå kan han lukte gull, derfor ror vi inn mot land',
                  status: STATUS_GJENNOMFOERT,
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
                      etiketter: [{ kode: 'AKTUELL' }, { kode: 'AVSLAG' }],
                  },
              }),
          }),
          wrapAktivitet({
              ...enEksternAktivitet({
                  tittel: 'Saltrød og Høneby',
                  status: STATUS_GJENNOMFOERT,
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
                  tittel: 'Saltrød og Høneby - med oppgave',
                  status: 'GJENNOMFORES',
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
                              type: 'FELLES',
                          },
                          {
                              tekst: 'Denne handlingen kan kun veiledere se',
                              subtekst: undefined,
                              url: 'https://www.nav.no/',
                              type: 'INTERN',
                          },
                      ],
                      detaljer: [
                          { label: 'Abc', verdi: 'def' },
                          { label: 'ghi', verdi: 'jkl' },
                      ],
                      etiketter: undefined,
                  },
              }),
          }),
      ];
