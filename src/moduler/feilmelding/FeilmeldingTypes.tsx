interface FeilmeldingDetaljer {
    id?: string;
    type?: string; //Intern feiltype
    detaljer?: {
        detaljertType: string;
        feilMelding: string;
        stackTrace: string;
    };
}

export interface FeilmeldingType {
    httpStatus?: number;
    melding?: FeilmeldingDetaljer;
    tekst?: string;
    type: string; //TODO: det her er action name, rename
}
