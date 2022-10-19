export enum FellesTransaksjonsTyper {
    OPPRETTET = 'OPPRETTET',
    STATUS_ENDRET = 'STATUS_ENDRET',
    DETALJER_ENDRET = 'DETALJER_ENDRET',
    AVTALT = 'AVTALT',
    AVTALT_DATO_ENDRET = 'AVTALT_DATO_ENDRET',
    BLE_HISTORISK = 'BLE_HISTORISK',
    FORHAANDSORIENTERING_LEST = 'FORHAANDSORIENTERING_LEST',
}

export enum StillingTransaksjonsType {
    ETIKETT_ENDRET = 'ETIKETT_ENDRET',
}

export enum MoteTransaksjonsType {
    MOTE_TID_OG_STED_ENDRET = 'MOTE_TID_OG_STED_ENDRET',
    REFERAT_OPPRETTET = 'REFERAT_OPPRETTET',
    REFERAT_ENDRET = 'REFERAT_ENDRET',
    REFERAT_PUBLISERT = 'REFERAT_PUBLISERT',
}

export enum SamtaleReferatTransaksjonsType {
    REFERAT_OPPRETTET = 'REFERAT_OPPRETTET',
    REFERAT_ENDRET = 'REFERAT_ENDRET',
    REFERAT_PUBLISERT = 'REFERAT_PUBLISERT',
}

export enum StillingFraNavTransaksjonsType {
    SOKNADSSTATUS_ENDRET = 'SOKNADSSTATUS_ENDRET',
    IKKE_FATT_JOBBEN = 'IKKE_FATT_JOBBEN',
    DEL_CV_SVART = 'DEL_CV_SVART',
}

export type TransaksjonsType =
    | FellesTransaksjonsTyper
    | StillingTransaksjonsType
    | MoteTransaksjonsType
    | SamtaleReferatTransaksjonsType
    | StillingFraNavTransaksjonsType;
