type StringOrNull = string | null;
//aktivitetType definisjonen bor også i .\const som *_AKTIVITET_TYPE finens det noen smartere måte å gjøre dette på?
export type AktivitetType =
    | 'EGEN'
    | 'STILLING'
    | 'TILTAKSAKTIVITET'
    | 'GRUPPEAKTIVITET'
    | 'UTDANNINGSAKTIVITET'
    | 'SOKEAVTALE'
    | 'IJOBB'
    | 'BEHANDLING'
    | 'MOTE'
    | 'SAMTALEREFERAT';
//aktivitetStatusd efinisjonen bor også i .\const som STATUS_*
export type AktivitetStatus = 'AVBRUTT' | 'FULLFORT' | 'GJENNOMFORES' | 'PLANLAGT' | 'BRUKER_ER_INTERESSERT';
export type StillingsStatus = 'INGEN_VALGT' | 'SOKNAD_SENDT' | 'INNKALT_TIL_INTERVJU' | 'AVSLAG' | 'JOBBTILBUD';
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
    endretAv: string;
    avtalt: boolean;
}
export interface Aktivitet extends AktivitetRequiredProps {
    fraDato?: string;
    tilDato?: string;
    endretDato?: string;
    avsluttetKommentar?: string;
    etikett?: StillingsStatus;
    historisk?: boolean;
    forhaandsorientering?: Forhaandsorientering;
    lagtInnAv?: string;
    detaljer?: object;
    beskrivelse?: string;
    erReferatPublisert?: boolean;
    nesteStatus?: AktivitetStatus;
    referat?: string;
    arbeidsgiver?: StringOrNull;
    antallStillingerSokes?: number;
    antallStillingerIUken?: number;
    arenaAktivitet?: boolean;
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
}
