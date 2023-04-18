interface RequiredLenkeProps {
    tekst: string;
    subtekst?: string;
    url: string;
}

type LenkeType = 'EKSTERN' | 'INTERN' | 'FELLES';

type Lenke = RequiredLenkeProps

export interface Oppgave extends Lenke {
    knapptekst: string;
}

export interface LenkeMedType extends RequiredLenkeProps {
    lenkeType: LenkeType;
}

export interface OppgaveLenke {
    ekstern?: Oppgave;
    intern?: Oppgave;
}

export interface Etikett {
    kode: string;
}

export interface Detalj {
    label: string;
    verdi: string;
}
