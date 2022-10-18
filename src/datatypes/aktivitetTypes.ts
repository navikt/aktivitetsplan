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

export enum TransaksjonsType {
    OPPRETTET = 'OPPRETTET',
    STATUS_ENDRET = 'STATUS_ENDRET',
    DETALJER_ENDRET = 'DETALJER_ENDRET',
    AVTALT = 'AVTALT',
    AVTALT_DATO_ENDRET = 'AVTALT_DATO_ENDRET',
    ETIKETT_ENDRET = 'ETIKETT_ENDRET',
    MOTE_TID_OG_STED_ENDRET = 'MOTE_TID_OG_STED_ENDRET',
    REFERAT_OPPRETTET = 'REFERAT_OPPRETTET',
    REFERAT_ENDRET = 'REFERAT_ENDRET',
    REFERAT_PUBLISERT = 'REFERAT_PUBLISERT',
    BLE_HISTORISK = 'BLE_HISTORISK',
    FORHAANDSORIENTERING_LEST = 'FORHAANDSORIENTERING_LEST',
    DEL_CV_SVART = 'DEL_CV_SVART',
    SOKNADSSTATUS_ENDRET = 'SOKNADSSTATUS_ENDRET',
    IKKE_FATT_JOBBEN = 'IKKE_FATT_JOBBEN',
}

export type BrukerType = 'NAV' | 'BRUKER';

export interface Lest {
    tidspunkt: string;
    verdi?: string;
    ressurs: string;
}

export interface AktivitetBaseProps {
    id: string;
    versjon: string;
    tittel: string;
    opprettetDato: string;
    status: AktivitetStatus;
    lagtInnAv: BrukerType;
    forhaandsorientering?: Forhaandsorientering;
    endretAv: string;
    endretDato?: string;
    avtalt: boolean;
    etikett?: StillingsStatus;
    transaksjonsType: TransaksjonsType;
    historisk: boolean;
    fraDato?: string;
    tilDato?: string;
    avsluttetKommentar?: string;
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

export function isVeilarbAktivitetAktivitet(aktivitet: AlleAktiviteter): aktivitet is VeilarbAktivitet {
    return !isArenaAktivitet(aktivitet);
}
/*
export function isHistorisk(aktivitet): boolean {

}*/

// export interface Aktivitet extends AktivitetRequiredProps {
//     fraDato?: string;
//     tilDato?: string;
//     endretDato?: string;
//     avsluttetKommentar?: string;
//     etikett?: StillingsStatus;
//     historisk?: boolean;
//     forhaandsorientering?: Forhaandsorientering;
//     detaljer?: object;
//     beskrivelse?: string;
//     erReferatPublisert?: boolean;
//     nesteStatus?: AktivitetStatus;
//     referat?: string;
//     arbeidsgiver?: StringOrNull;
//     antallStillingerSokes?: number;
//     antallStillingerIUken?: number;
//     arenaAktivitet?: false;
//     avsluttetBegrunnelse?: string;
// }
