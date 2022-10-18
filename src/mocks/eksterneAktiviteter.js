import { wrapAktivitet } from './aktivitet';
import { visEksterneAktiviteter } from './demo/sessionstorage';
import { enEksternAktivitet } from './fixtures/eksternAktivitetFixtures';

export const eksterneAktiviteter = !visEksterneAktiviteter()
    ? []
    : [
          wrapAktivitet({
              ...enEksternAktivitet({
                  tittel: 'asd',
                  status: 'GJENNOMFORES',
                  beskrivelse: 'Beskrivelse asdasdasdsasd',
                  eksternAktivitetData: {
                      type: 'LONNSTILSKUDD',
                  },
              }),
          }),
      ];
