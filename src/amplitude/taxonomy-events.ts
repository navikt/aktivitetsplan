import { TextCheckerAmplitudeAnalysis } from './amplitude';

export type AmplitudeEvent =
    | {
          name: 'referat lagret';
          data: {
              analysis: TextCheckerAmplitudeAnalysis;
              referatPublisert: boolean;
              spraksjekkEnabled: boolean;
          };
      }
    | { name: 'toggle'; data: { text: string; enabled: boolean } }
    | { name: 'knapp klikket'; data: { tekst: string } }
    | { name: 'accordion åpnet'; data: { tekst: string } }
    | { name: 'filtervalg'; data: { filternavn: string } };
