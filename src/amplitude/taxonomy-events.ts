export type AmplitudeEvent =
    | {
          name: 'referat fullført';
          data: {
              analysis: unknown;
              type: 'CREATE' | 'UPDATE';
              spraksjekkVersjon: string;
              spraksjekkEnabled: boolean;
          };
      }
    | { name: 'språksjekk toggle'; data: { enabled: boolean } };
