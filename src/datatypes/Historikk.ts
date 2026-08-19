import { AktivitetsVersjon } from './brandedTypes';

export interface Endring {
    endretAvType: string;
    endretAv: string;
    tidspunkt: string;
    beskrivelseForVeileder: string;
    beskrivelseForBruker: string;
    forrigeVersjonsId: AktivitetsVersjon;
}

export interface Historikk {
    endringer: Endring[];
}
