import { brukertype } from '../types';

export interface Dialog {
    id: string;
    overskrift: string;
    aktivitetId?: string;
    lest?: boolean;
    sisteDato: string;
    sisteTekst?: string;
    erLestAvBruker?: boolean;
    venterPaSvar?: boolean;
    ferdigBehandlet?: boolean;
    opprettetDato: string;
    henvendelser?: Henvendelse[];
    egenskaper?: string[];
}

export interface Henvendelse {
    id: string;
    dialogId: string;
    tekst: string;
    avsender: brukertype;
    avsenderId?: string;
    sendt: string;
    lest: boolean;
}
