export interface Forhaandsorientering {
    type: ForhaandsorienteringType;
    tekst: string;
    lestDato?: string;
}

export enum ForhaandsorienteringType {
    SEND_STANDARD = 'SEND_FORHAANDSORIENTERING',
    SEND_PARAGRAF_11_9 = 'SEND_PARAGRAF_11_9',
    IKKE_SEND = 'IKKE_SEND_FORHAANDSORIENTERING',
}
