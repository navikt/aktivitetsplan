import { erEskalertBruker } from '../demo/sessionstorage';

export const eskaleringsvarsel = erEskalertBruker()
    ? {
          id: '1234',
          tilhorendeDialogId: '1',
          opprettetAv: 'z12344',
          opprettetDato: '2022-01-28T12:48:56.097+01:00',
          opprettetBegrunnelse: 'Derfor! Eskaler!',
      }
    : null;
