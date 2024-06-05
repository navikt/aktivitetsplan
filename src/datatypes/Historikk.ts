export interface Endring {
    endretAvType: string;
    endretAv: string;
    tidspunkt: string;
    beskrivelseForVeileder: string;
    beskrivelseForBruker: string;
}

export interface Historikk {
    endringer: Endring[];
}
