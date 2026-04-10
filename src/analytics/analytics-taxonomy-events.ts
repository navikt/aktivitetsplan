import { TextCheckerAnalyticsAnalysis } from './analytics';

export enum FeltEndret {
    TITTEL = 'tittel',
    DATO = 'dato',
    KLOKKESLETT = 'klokkeslett',
    VARIGHET = 'varighet',
    KANAL = 'kanal',
    ADRESSE = 'adresse',
    BESKRIVELSE = 'beskrivelse',
    FORBEREDELSER = 'forberedelser',
}
export type AnalyticsEvent =
    | {
          name: 'referat lagret';
          data: {
              analysis: TextCheckerAnalyticsAnalysis;
              referatPublisert: boolean;
              spraksjekkEnabled: boolean;
          };
      }
      | { name: 'detaljer endret'; data: { feltEndret: string } }
    | { name: 'toggle'; data: { text: string; enabled: boolean } }
    | { name: 'dyplenking'; data: { text: string } }
    | { name: 'knapp klikket'; data: { tekst: string } }
    | { name: 'navigere'; data: { tekst: string } }
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
