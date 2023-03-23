import { ArenaAktivitet, ArenaAktivitetType } from './arenaAktivitetTypes';
import { Forhaandsorientering } from './forhaandsorienteringTypes';
import { VeilarbAktivitet, VeilarbAktivitetType } from './internAktivitetTypes';
import { FellesTransaksjonsTyper } from './transaksjonstyperTypes';

export type AktivitetType = VeilarbAktivitetType | ArenaAktivitetType;

export enum AktivitetStatus {
    STATUS_BRUKER_ER_INTRESSERT = 'BRUKER_ER_INTERESSERT',
    STATUS_PLANLAGT = 'PLANLAGT',
    STATUS_GJENNOMFOERT = 'GJENNOMFORES',
    STATUS_FULLFOERT = 'FULLFORT',
    STATUS_AVBRUTT = 'AVBRUTT',
}

export enum StillingStatus {
    INGEN_VALGT = 'INGEN_VALGT',
    SOKNAD_SENDT = 'SOKNAD_SENDT',
    INNKALT_TIL_INTERVJU = 'INNKALT_TIL_INTERVJU',
    AVSLAG = 'AVSLAG',
    JOBBTILBUD = 'JOBBTILBUD',
}

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
    etikett?: StillingStatus; // todo sjekk ut hvorfor denne ligger på baseprops og ikke i StillingAktivitet
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
