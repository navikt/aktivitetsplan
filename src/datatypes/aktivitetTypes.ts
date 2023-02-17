import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../constant';
import { ArenaAktivitet, ArenaAktivitetType } from './arenaAktivitetTypes';
import { Forhaandsorientering } from './forhaandsorienteringTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from './internAktivitetTypes';
import { FellesTransaksjonsTyper } from './transaksjonstyperTypes';

export type AktivitetType = VeilarbAktivitetType | ArenaAktivitetType;

export type AktivitetStatus =
    | typeof STATUS_AVBRUTT
    | typeof STATUS_FULLFOERT
    | typeof STATUS_GJENNOMFOERT
    | typeof STATUS_PLANLAGT
    | typeof STATUS_BRUKER_ER_INTRESSERT;

export type StillingsStatus = 'INGEN_VALGT' | 'SOKNAD_SENDT' | 'INNKALT_TIL_INTERVJU' | 'AVSLAG' | 'JOBBTILBUD';
export type StillingFraNavSoknadsstatus =
    | 'VENTER'
    | 'CV_DELT'
    | 'SKAL_PAA_INTERVJU'
    | 'JOBBTILBUD'
    | 'AVSLAG'
    | 'IKKE_FATT_JOBBEN';
export type Livslopsstatus =
    | 'PROVER_VARSLING'
    | 'HAR_VARSLET'
    | 'KAN_IKKE_VARSLE'
    | 'HAR_SVART'
    | 'AVBRUTT_AV_SYSTEM'
    | 'AVBRUTT_AV_BRUKER';

export type BrukerType = 'BRUKER' | 'ARBEIDSGIVER' | 'TILTAKSARRANGOER' | 'NAV' | 'SYSTEM' | 'ARENAIDENT';

export type JobbStatusType = 'HELTID' | 'DELTID';

export interface Lest {
    tidspunkt: string;
    verdi?: string;
    ressurs: string;
}

export interface AktivitetBaseProps<T = FellesTransaksjonsTyper> {
    id: string;
    versjon: string;
    tittel: string;
    opprettetDato: string;
    status: AktivitetStatus;
    endretAvType: BrukerType;
    forhaandsorientering?: Forhaandsorientering;
    endretAv: string;
    endretDato?: string;
    avtalt: boolean;
    etikett?: StillingsStatus;
    transaksjonsType: T;
    historisk: boolean;
    fraDato?: string;
    tilDato?: string;
    avsluttetKommentar?: string;
    beskrivelse?: string;
    lenke?: string;
}

export type AlleAktiviteter = VeilarbAktivitet | ArenaAktivitet;

export function isArenaAktivitet(aktivitet: AlleAktiviteter): aktivitet is ArenaAktivitet {
    return (
        [
            ArenaAktivitetType.GRUPPEAKTIVITET,
            ArenaAktivitetType.TILTAKSAKTIVITET,
            ArenaAktivitetType.UTDANNINGSAKTIVITET,
        ] as string[]
    ).includes(aktivitet.type);
}

export function isVeilarbAktivitet(aktivitet: AlleAktiviteter): aktivitet is VeilarbAktivitet {
    return !isArenaAktivitet(aktivitet);
}
