import { AktivitetStatus, FilterTag } from './aktivitetTypes';
import { Forhaandsorientering } from './forhaandsorienteringTypes';

export enum ArenaEtikett {
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

export enum ArenaAktivitetType {
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
    fraDato?: string;
    tilDato: string;
    opprettetDato: string;
    avtalt: boolean;
    etikett: ArenaEtikett;

    forhaandsorientering?: Forhaandsorientering;

    filterTags: FilterTag[];

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
