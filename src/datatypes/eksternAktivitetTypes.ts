interface RequiredLenkeProps {
    tekst: string;
    subtekst?: string;
    url: string;
}

type LenkeType = 'EKSTERN' | 'INTERN' | 'FELLES';

type Lenke = RequiredLenkeProps;

type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export interface Oppgave extends Lenke {
    // TODO: Få denne fra backend, den finnes ikke der idag (desverre :( )
    knapptekst?: string;
}

export interface LenkeMedType extends RequiredLenkeProps {
    lenkeType: LenkeType;
}

export interface OppgaveLenke {
    ekstern?: Oppgave;
    intern?: Oppgave;
}

export interface Etikett {
    tekst: string | null;
    sentiment: SentimentType | null;
    kode: string;
}

export interface Detalj {
    label: string;
    verdi: string;
}
