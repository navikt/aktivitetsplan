interface RequiredLenkeProps {
    tekst: string;
    subtekst: string;
    url: URL;
}

interface URL {
    params: Map<string, string>;
    path: string;
}

type LenkeType = 'EKSTERN' | 'INTERN' | 'FELLES';

interface Lenke extends RequiredLenkeProps {}

export interface LenkeMedType extends RequiredLenkeProps {
    type: LenkeType;
}

export interface OppgaveLenke {
    ekstern: Lenke;
    intern: Lenke;
}

export interface Etikett {
    kode: string;
}

export interface Detalj {
    [key: string]: [value: string];
}
