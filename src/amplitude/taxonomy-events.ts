import { TextCheckerAnalytics } from './amplitude';

export type AnalyticsEvent =
    | {
          name: 'referat lagret';
          data: {
              analysis: TextCheckerAnalytics;
              referatPublisert: boolean;
              spraksjekkEnabled: boolean;
          };
      }
    | { name: 'toggle'; data: { text: string; enabled: boolean } }
    | { name: 'dyplenking'; data: {text: string }}
    | { name: 'knapp klikket'; data: { tekst: string } }
    | { name: 'accordion åpnet'; data: { tekst: string } }
    | { name: 'filtervalg'; data: { filternavn: string } }
    | {
          name: 'modal lukket';
          data: {
              isDirty: boolean;
              aktivitet: string;
              modalType: 'ny-aktivitet' | 'endre-aktivitet';
              navType: 'onReqBack' | 'onReqClose';
          };
      };
