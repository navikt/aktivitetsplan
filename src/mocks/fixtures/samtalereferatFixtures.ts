import { subDays } from 'date-fns';

import { AktivitetStatus, Kanal } from '../../datatypes/aktivitetTypes';
import { SamtalereferatAktivitet, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { FellesTransaksjonsTyper } from '../../datatypes/transaksjonstyperTypes';
import { AktivitetsId, AktivitetsVersjon, OppfolgingsPeriodeId } from '../../datatypes/brandedTypes';

export const enSamtalereferatAktivitet = (
    overrides: Partial<SamtalereferatAktivitet> = {},
): SamtalereferatAktivitet => ({
    id: '1234' as AktivitetsId,
    oppfolgingsperiodeId: 'a2aa22a2-2aa2-4e02-8cc2-d44ef605fa33' as OppfolgingsPeriodeId,
    versjon: '1' as AktivitetsVersjon,
    tittel: 'Samtalereferat',
    type: VeilarbAktivitetType.SAMTALEREFERAT_TYPE,
    status: AktivitetStatus.GJENNOMFOERT,
    fraDato: subDays(new Date(), 1).toISOString(),
    opprettetDato: subDays(new Date(), 2).toISOString(),
    endretDato: subDays(new Date(), 1).toISOString(),
    endretAv: 'z990207',
    endretAvType: 'NAV',
    historisk: false,
    avtalt: false,
    transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
    kanal: Kanal.OPPMOTE,
    referat: 'Dette er et samtalereferat',
    erReferatPublisert: false,
    avsluttetKommentar: undefined,
    forhaandsorientering: undefined,
    ...overrides,
});
