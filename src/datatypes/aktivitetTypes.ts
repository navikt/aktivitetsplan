import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    SOKEAVTALE_AKTIVITET_TYPE,
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
    STILLING_AKTIVITET_TYPE,
    STILLING_FRA_NAV_TYPE,
    TILTAK_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../constant';

type StringOrNull = string | null;

export type AktivitetType =
    | typeof EGEN_AKTIVITET_TYPE
    | typeof STILLING_AKTIVITET_TYPE
    | typeof TILTAK_AKTIVITET_TYPE
    | typeof GRUPPE_AKTIVITET_TYPE
    | typeof UTDANNING_AKTIVITET_TYPE
    | typeof SOKEAVTALE_AKTIVITET_TYPE
    | typeof IJOBB_AKTIVITET_TYPE
    | typeof BEHANDLING_AKTIVITET_TYPE
    | typeof MOTE_TYPE
    | typeof SAMTALEREFERAT_TYPE
    | typeof STILLING_FRA_NAV_TYPE;

export type AktivitetStatus =
    | typeof STATUS_AVBRUTT
    | typeof STATUS_FULLFOERT
    | typeof STATUS_GJENNOMFOERT
    | typeof STATUS_PLANLAGT
    | typeof STATUS_BRUKER_ER_INTRESSERT;

export type StillingsStatus = 'INGEN_VALGT' | 'SOKNAD_SENDT' | 'INNKALT_TIL_INTERVJU' | 'AVSLAG' | 'JOBBTILBUD';
export type StillingFraNavSoknadsstatus = 'VENTER' | 'SKAL_PAA_INTERVJU' | 'JOBBTILBUD' | 'AVSLAG';
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
}
export type BrukerType = 'NAV' | 'BRUKER';
export interface Lest {
    tidspunkt: string;
    verdi?: string;
    ressurs: string;
}

interface AktivitetRequiredProps {
    id: string;
    versjon: string;
    tittel: string;
    opprettetDato: string;
    status: AktivitetStatus;
    type: AktivitetType;
    lagtInnAv: BrukerType;
    endretAv: string;
    avtalt: boolean;
    transaksjonsType: TransaksjonsType;
    stillingFraNavData: StillingFraNavAktivitetData | null;
}

export interface Aktivitet extends AktivitetRequiredProps {
    fraDato?: string;
    tilDato?: string;
    endretDato?: string;
    avsluttetKommentar?: string;
    etikett?: StillingsStatus;
    historisk?: boolean;
    forhaandsorientering?: Forhaandsorientering;
    detaljer?: object;
    beskrivelse?: string;
    erReferatPublisert?: boolean;
    nesteStatus?: AktivitetStatus;
    referat?: string;
    arbeidsgiver?: StringOrNull;
    antallStillingerSokes?: number;
    antallStillingerIUken?: number;
    arenaAktivitet?: boolean;
    avsluttetBegrunnelse?: string;
}

export interface MedisinskBehandlingAktivitet extends AktivitetRequiredProps {
    fraDato: string;
    tilDato: string;
    behandlingType: string;
    behandlingSted: string;
    effekt: string; //TODO: Rename i api, mål for behandlingen
    behandlingOppfolging: string; //oppfølging fra nav, utgått
    beskrivelse: string;
}

export interface CvKanDelesData {
    kanDeles: boolean;
    endretTidspunkt: Date;
    avtaltDato: Date;
    endretAv: string;
    endretAvType: BrukerType;
}

export interface KontaktInfo {
    navn: string;
    tittel: string;
    mobil: string;
    epost: string;
}

export interface StillingFraNavAktivitetData {
    cvKanDelesData: CvKanDelesData;
    soknadsfrist: string;
    svarfrist: string;
    arbeidsgiver: string;
    bestillingsId: string;
    stillingsId: string;
    arbeidssted: string;
    varselId: string;
    lenke: string; //mangler i backend
    kontaktpersonData: KontaktInfo;
    soknadsstatus: StillingFraNavSoknadsstatus;
}

enum ArenaEtikett {
    AKTUELL = 'AKTUELL',
    AVSLAG = 'AVSLAG',
    IKKAKTUELL = 'IKKAKTUELL',
    IKKEM = 'IKKEM',
    INFOMOETE = 'INFOMOETE',
    JATAKK = 'JATAKK',
    NEITAKK = 'NEITAKK',
    TILBUD = 'TILBUD',
    VENTELISTE = 'VENTELISTE',
}

enum ArenaAktivitetType {
    TILTAKSAKTIVITET = 'TILTAKSAKTIVITET',
    GRUPPEAKTIVITET = 'GRUPPEAKTIVITET',
    UTDANNINGSAKTIVITET = 'UTDANNINGSAKTIVITET',
}

interface Moteplan {
    startDato: string;
    sluttDato: string;
    sted: string;
}

//Flere av disse kan muligens være null
export interface ArenaAktivitet {
    //Felles
    id: string;
    status: AktivitetStatus;
    type: ArenaAktivitetType;
    tittel: string;
    beskrivelse: string;
    fraDato: string;
    tilDato: string;
    opprettetDato: string;
    avtalt: boolean;
    etikett: ArenaEtikett;
    forhaandsorientering?: Forhaandsorientering;

    // Tiltaksaktivitet
    deltakelseProsent: number;
    tiltaksnavn: string;
    tiltakLokaltNavn: string;
    arrangoer: string;
    bedriftsnummer: string;
    antallDagerPerUke: number;
    statusSistEndret: string;

    // Gruppeaktivitet
    moeteplanListe: Moteplan[];
}

export enum ForhaandsorienteringType {
    SEND_STANDARD = 'SEND_FORHAANDSORIENTERING',
    SEND_PARAGRAF_11_9 = 'SEND_PARAGRAF_11_9',
    IKKE_SEND = 'IKKE_SEND_FORHAANDSORIENTERING',
}

export interface Forhaandsorientering {
    type: ForhaandsorienteringType;
    tekst: string;
    lestDato?: string;
}
