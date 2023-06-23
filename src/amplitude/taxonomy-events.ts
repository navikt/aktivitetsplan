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
    | { name: 'toggle'; data: { text: string; enabled: boolean } };
