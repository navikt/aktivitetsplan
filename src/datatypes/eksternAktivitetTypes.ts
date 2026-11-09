export interface Lenke {
    tekst: string;
    subtekst?: string;
    url: string;
}

type LenkeType = 'EKSTERN' | 'INTERN' | 'FELLES';

type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';


export interface LenkeMedType extends Lenke {
    lenkeType: LenkeType;
}

export interface OppgaveLenke {
    ekstern?: Lenke;
    intern?: Lenke;
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
