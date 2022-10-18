interface RequiredLenkeProps {
    tekst: String;
    subtekst: String;
    url: URL;
}

interface URL {
    params: Map<string, string>;
    path: String;
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
    kode: String;
}

export interface Detalj {
    [key: string]: [value: string];
}
