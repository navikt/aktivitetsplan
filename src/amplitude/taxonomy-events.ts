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
    | { name: 'knapp klikket'; data: { text: string; knapp: string } }
    | { name: 'accordion åpnet'; data: { text: string; accordion: string } }
    | { name: 'spill av film'; data: { text: string; film: string } }
    | { name: 'filtervalg'; data: { text: string; filterValgt: string } };
